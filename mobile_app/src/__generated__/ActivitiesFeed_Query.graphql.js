/**
 * @flow
 * @relayHash 638d97251d68169676ef948739fc386c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ActivitiesFeed_QueryVariables = {| |};
export type ActivitiesFeed_QueryResponse = {|
  +me: ?{|
    +firstName?: ?string,
    +lastName?: ?string,
    +getActivities?: ?{|
      +edges: ?$ReadOnlyArray<?{|
        +node: ?{|
          +id: string,
        |},
      |}>,
    |},
  |},
|};
*/


/*
query ActivitiesFeed_Query {
  me: node(id: "VXNlcjox") {
    __typename
    ... on User {
      firstName
      lastName
      getActivities(first: 50) {
        edges {
          node {
            id
          }
        }
      }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
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
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "getActivities",
      "storageKey": "getActivities(first:50)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50,
          "type": "Int"
        }
      ],
      "concreteType": "ActivityConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ActivityEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Activity",
              "plural": false,
              "selections": [
                v1
              ]
            }
          ]
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ActivitiesFeed_Query",
  "id": null,
  "text": "query ActivitiesFeed_Query {\n  me: node(id: \"VXNlcjox\") {\n    __typename\n    ... on User {\n      firstName\n      lastName\n      getActivities(first: 50) {\n        edges {\n          node {\n            id\n          }\n        }\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ActivitiesFeed_Query",
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
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ActivitiesFeed_Query",
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
          v1,
          v2
        ]
      }
    ]
  }
};
})();
(node/*: any*/).hash = '09b7ad8ac21316dc0d8ffc1610162c62';
module.exports = node;
