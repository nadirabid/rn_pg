import {
  Source,
  parse,
  validate,
  execute,
  formatError,
  getOperationAST,
  specifiedRules,
  GraphQLError,
  GraphQLSchema
} from 'graphql';
import httpError from 'http-errors';
import { Context, Request, Response } from 'koa';
import { IMiddleware, IRouterContext } from 'koa-router';
import url from 'url';

import { renderGraphiQL } from './renderGraphiQL';
import { parseBody } from './parseBody';

export type Options = ((req: Request, res: Response) => OptionsData) | ((req: Request, res: Response) => Promise<OptionsData>) | OptionsData

export type OptionsData = {
  /**
   * A GraphQL schema from graphql-js.
   */
  schema: Object,

  /**
   * A value to pass as the context to the graphql() function.
   */
  context?: Object,

  /**
   * An object to pass as the rootValue to the graphql() function.
   */
  rootValue?: Object,

  /**
   * A boolean to configure whether the output should be pretty-printed.
   */
  pretty?: boolean,

  /**
   * An optional function which will be used to format any errors produced by
   * fulfilling a GraphQL operation. If no function is provided, GraphQL's
   * default spec-compliant `formatError` function will be used.
   */
  formatError?: Function,

  /**
   * A boolean to optionally enable GraphiQL mode.
   */
  graphiql?: boolean,

  /**
   * An optional function for adding additional metadata to the GraphQL response as a key-value object.
   * The result will be added to "extensions" field in the resulting JSON.
   */
  extensions?: ((args: ExtenstionsArgs) => any) | ((args: ExtenstionsArgs) => Promise<any>);

};

interface ExtenstionsArgs {
  document: object,
  variables: object,
  operationName: any,
  result: object
}

type GraphQLParams = {
  query?: string
  variables?: { [name: string]: any },
  operationName?: string,
  raw?: boolean,
};

function typeormResolver(source, args, ctx) {
  
}

function graphqlTypeormHTTP(optionsData: OptionsData): IMiddleware {
  return async function middleware(ctx: IRouterContext): Promise<void> {
    const req = ctx.req;
    const request = ctx.request;
    const response = ctx.response;

    let schema;
    let context;
    let rootValue;
    let pretty;
    let graphiql;
    let formatErrorFn;
    let extensionsFn;
    let showGraphiQL;
    let query;
    let documentAST;
    let variables;
    let operationName;
    let validationRules;
    let result;

    // Collect information from the options data object.
    schema = optionsData.schema;
    context = optionsData.context || ctx;
    rootValue = optionsData.rootValue;
    pretty = optionsData.pretty;
    graphiql = optionsData.graphiql;
    formatErrorFn = optionsData.formatError;
    extensionsFn = optionsData.extensions;

    // GraphQL HTTP only supports GET and POST methods.
    if (request.method !== 'GET' && request.method !== 'POST') {
      response.set('Allow', 'GET, POST');
      throw httpError(405, 'GraphQL only supports GET and POST requests.');
    }

    const params: GraphQLParams = await getGraphQLParams(request);

    // Get GraphQL params from the request and POST body data.
    query = params.query;
    variables = params.variables;
    operationName = params.operationName;
    showGraphiQL = graphiql && canDisplayGraphiQL(request, params);

    result = await new Promise(resolve => {
      // If there is no query, but GraphiQL will be displayed, do not produce
      // a result, otherwise return a 400: Bad Request.
      if (!query) {
        if (showGraphiQL) {
          return resolve(null);
        }
        throw httpError(400, 'Must provide query string.');
      }

      // GraphQL source.
      const source = new Source(query, 'GraphQL request');

      // Parse source to AST, reporting any syntax error.
      try {
        documentAST = parse(source);
      } catch (syntaxError) {
        // Return 400: Bad Request if any syntax errors errors exist.
        response.status = 400;
        return resolve({ errors: [syntaxError] });
      }

      // Validate AST, reporting any errors.
      const validationErrors = validate(schema, documentAST, validationRules);
      if (validationErrors.length > 0) {
        // Return 400: Bad Request if any validation errors exist.
        response.status = 400;
        return resolve({ errors: validationErrors });
      }

      // Only query operations are allowed on GET requests.
      if (request.method === 'GET') {
        // Determine if this GET request will perform a non-query.
        const operationAST = getOperationAST(documentAST, operationName);
        if (operationAST && operationAST.operation !== 'query') {
          // If GraphiQL can be shown, do not perform this query, but
          // provide it to GraphiQL so that the requester may perform it
          // themselves if desired.
          if (showGraphiQL) {
            return resolve(null);
          }

          // Otherwise, report a 405: Method Not Allowed error.
          response.set('Allow', 'POST');
          throw httpError(
            405,
            `Can only perform a ${operationAST.operation} operation ` +
              'from a POST request.',
          );
        }
      }

      // Perform the execution, reporting any errors creating the context.
      try {
        resolve(
          execute(
            schema,
            documentAST,
            rootValue,
            context,
            variables,
            operationName,
          ),
        );
      } catch (contextError) {
        // Return 400: Bad Request if any execution context errors exist.
        response.status = 400;
        resolve({ errors: [contextError] });
      }
    });

    // Collect and apply any metadata extensions if a function was provided.
    // http://facebook.github.io/graphql/#sec-Response-Format
    if (result && extensionsFn) {
      result = await Promise.resolve(
        extensionsFn({
          document: documentAST,
          variables,
          operationName,
          result,
        }),
      ).then(extensions => {
        if (extensions && typeof extensions === 'object') {
          result.extensions = extensions;
        }
        return result;
      });
    }

    // If no data was included in the result, that indicates a runtime query
    // error, indicate as such with a generic status code.
    // Note: Information about the error itself will still be contained in
    // the resulting JSON payload.
    // http://facebook.github.io/graphql/#sec-Data
    if (result && result.data === null) {
      response.status = 500;
    }
    // Format any encountered errors.
    if (result && result.errors) {
      result.errors = result.errors.map(
        err => (formatErrorFn ? formatErrorFn(err, context) : formatError(err)),
      );
    }

    // If allowed to show GraphiQL, present it instead of JSON.
    if (showGraphiQL) {
      const payload = renderGraphiQL({
        query,
        variables,
        operationName,
        result,
      });
      response.type = 'text/html';
      response.body = payload;
    } else {
      // Otherwise, present JSON directly.
      const payload = pretty ? JSON.stringify(result, null, 2) : result;
      response.type = 'application/json';
      response.body = payload;
    }
  };
}

function getGraphQLParams(request: Request): Promise<GraphQLParams> {
  return parseBody(request).then(bodyData => {
    const urlData = (request.url && url.parse(request.url, true).query) || {};
    return parseGraphQLParams(urlData, bodyData);
  });
}

function parseGraphQLParams(
  urlData: { [param: string]: any },
  bodyData: { [param: string]: any },
): GraphQLParams {
  // GraphQL Query string.
  let query = urlData.query || bodyData.query;
  if (typeof query !== 'string') {
    query = null;
  }

  // Parse the variables if needed.
  let variables = urlData.variables || bodyData.variables;
  if (variables && typeof variables === 'string') {
    try {
      variables = JSON.parse(variables);
    } catch (error) {
      throw httpError(400, 'Variables are invalid JSON.');
    }
  } else if (typeof variables !== 'object') {
    variables = null;
  }

  // Name of GraphQL operation to execute.
  let operationName = urlData.operationName || bodyData.operationName;
  if (typeof operationName !== 'string') {
    operationName = null;
  }

  const raw = urlData.raw !== undefined || bodyData.raw !== undefined;

  return { query, variables, operationName, raw };
}

/**
 * Helper function to determine if GraphiQL can be displayed.
 */
function canDisplayGraphiQL(request: Request, params: GraphQLParams): boolean {
  // If `raw` exists, GraphiQL mode is not enabled.
  // Allowed to show GraphiQL if not requested as raw and this request
  // prefers HTML over JSON.
  return !params.raw && request.accepts(['json', 'html']) === 'html';
}
