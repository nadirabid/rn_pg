/**
 * @flow
 * @relayHash 2edae11bcdff5ccd792d811ade10dfaf
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppQueryVariables = {| |};
export type AppQueryResponse = {|
  +me: ?{|
    +firstName?: ?string,
    +lastName?: ?string,
  |},
|};
*/


/*
query AppQuery {
  me: node(id: "VXNlcjox") {
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
  "text": "query AppQuery {\n  me: node(id: \"VXNlcjox\") {\n    __typename\n    ... on User {\n      firstName\n      lastName\n    }\n    id\n  }\n}\n",
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
        "alias": "me",
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
        "alias": "me",
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
(node/*: any*/).hash = 'b4da1c645509a07af06b982075eadbb0';
module.exports = node;
