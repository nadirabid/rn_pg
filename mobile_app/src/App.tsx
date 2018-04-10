import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
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

// setup Environment

function fetchQuery(operation, variables) {
  return fetch('http://localhost:8000/graphql', {
    method: 'POST',
    headers: {}, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const source = new RecordSource()
const store = new Store(source)
const network = Network.create(fetchQuery) // see note below
const handlerProvider = undefined

const environment = new Environment({
  handlerProvider, // Can omit.
  network,
  store,
})

// App component

interface Props {}
interface State {}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export default class App extends Component<Props, State> {
  render() {
    return (
      <QueryRenderer
        environment={environment}

        query={graphql`
          query AppQuery {
            node(id: "VXNlcjox") {
                firstName
                lastName
            }
          }
        `}

        variables={{}}

        render={({error, props}) => {
          const user = get(props, 'user', {})

          if (error) {
            return (<Text>{error.message}</Text>)
          } else if (props) {
            return (
              <View style={styles.container}>
                <Text style={styles.welcome}>
                  Ryden
                </Text>
                <Text style={styles.welcome}>
                  Your name {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.instructions}>
                  {instructions}
                </Text>
              </View>
            )
          }
          return (<Text>Loading</Text>)
        }}
      />
    )
  }
}
