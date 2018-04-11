/**
 * @flow
 * @relayHash 04dad528d11ed428674f805bb54d30c3
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppQueryVariables = {| |};
export type AppQueryResponse = {|
  +node: ?{|
    +firstName?: ?string,
    +lastName?: ?string,
  |},
|};
*/


/*
query AppQuery {
  node(id: "VXNlcjox") {
    __typename
    ... on User {
      firstName
      lastName
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "VXNlcjox",
    "type": "ID!"
  }
],
v1 = {
  "kind": "InlineFragment",
  "type": "User",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "firstName",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastName",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppQuery",
  "id": null,
  "text": "query AppQuery {\n  node(id: \"VXNlcjox\") {\n    __typename\n    ... on User {\n      firstName\n      lastName\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppQuery",
    "type": "Root",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": "node(id:\"VXNlcjox\")",
        "args": v0,
        "concreteType": null,
        "plural": false,
        "selections": [
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AppQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": "node(id:\"VXNlcjox\")",
        "args": v0,
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          v1
        ]
      }
    ]
  }
};
})();
(node/*: any*/).hash = '7132a9e564399b0601c3c7ce1dace468';
module.exports = node;
