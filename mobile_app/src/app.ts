import React, { Component } from 'react'
import {
  Text,
  FlatList,
  View,
  StyleSheet,
} from 'react-native'
import Config from 'react-native-config'
import { Navigation } from 'react-native-navigation'
import {
  graphql,
  QueryRenderer,
} from 'react-relay'
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import { get } from 'lodash'

import registerScreens from './screens'

// TODO: https://github.com/30murgh/relay-native/tree/master/src

// setup Environment

console.log(Config.API_URL)

function fetchQuery(operation, variables) {
  return fetch(`${Config.API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json()
  }).catch(error => {
    return error
  })
}

const source = new RecordSource()
const store = new Store(source)
const network = Network.create(fetchQuery) 

const environment = new Environment({
  network,
  store,
})

registerScreens(environment)

export default function startApp() {
  Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Activities',
            screen: 'ryden.ActivitiesFeed'
        }
    ]
  })
}
