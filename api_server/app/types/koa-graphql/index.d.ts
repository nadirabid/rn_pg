// Type definitions for koa-graphql
// Project: https://www.npmjs.org/package/koa-graphql
// Definitions by: Isman Usoh <https://github.com/isman-usoh>
//                 Nitin Tutlani <https://github.com/nitintutlani>
//                 Daniel Fader <https://github.com/hubel>
//                 Ehsan Ziya <https://github.com/zya>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare module 'koa-graphql' {
  import { Request, Response } from 'koa';
  import { IMiddleware } from 'koa-router';

  export = graphqlHTTP;

  namespace graphqlHTTP {
    /**
     * Used to configure the graphQLHTTP middleware by providing a schema
     * and other configuration options.
     */
    export type Options = ((req: Request, res: Response) => OptionsObj) | ((req: Request, res: Response) => Promise<OptionsObj>) | OptionsObj
    export type OptionsObj = {
      /**
       * A GraphQL schema from graphql-js.
       */
      schema: any,

      /**
       * A value to pass as the context to the graphql() function.
       */
      context?: any,

      /**
       * An object to pass as the rootValue to the graphql() function.
       */
      rootValue?: any,

      /**
       * A boolean to configure whether the output should be pretty-printed.
       */
      pretty?: boolean,

      /**
       * An optional function which will be used to format any errors produced by
       * fulfilling a GraphQL operation. If no function is provided, GraphQL's
       * default spec-compliant `formatError` function will be used.
       */
      formatError?: any,

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
  }

  /**
  * Middleware for express; takes an options object or function as input to
  * configure behavior, and returns an express middleware.
  */
  function graphqlHTTP(options: graphqlHTTP.Options): IMiddleware;
}
