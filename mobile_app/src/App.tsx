import React, { Component } from 'react'
import {
  Text,
  FlatList,
  View,
  StyleSheet,
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

// TODO: https://github.com/30murgh/relay-native/tree/master/src

// setup Environment

function fetchQuery(operation, variables) {
  console.log('fetchQuery', operation, variables)

  return fetch('http://localhost:8000/graphql', {
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
    console.log('response', response)
    return response.json()
  }).catch(error => {
    console.log('error', error)
    return error
  })
}

const source = new RecordSource()
const store = new Store(source)
const network = Network.create(fetchQuery) // see note below

const environment = new Environment({
  network,
  store,
})

// App component

interface Props {}
interface State {}

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// })

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// })

const appQuery = graphql`
  query AppQuery {
    me: node(id: "VXNlcjox") {
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
    }
  }
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
  header: {
    paddingTop: 20,
    backgroundColor: 'darkturquoise', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ffff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})

export default class App extends Component<Props, State> {
  render() {
    return (
      <QueryRenderer
        environment={environment}

        query={appQuery}

        variables={{}}

        render={({error, props}) => {
          const activities: any[] = get(props, 'me.getActivities.edges', [])
          console.log(activities)

          if (error) {
            return (<Text>{error.message}</Text>)
          } else if (props) {
            return (
              <View style={styles.container}>
                <Text style={styles.welcome}>Ryden</Text>
                <FlatList
                  style={{ flex: 1 }}
                  keyExtractor={(item) => item.node.id}
                  data={activities}
                  renderItem={({ item }: { item: any }) => {
                    console.log('ITEM', item)
                    return (
                      <View style={styles.container2}>
                        <Text style={styles.welcome}>{item.node.id}</Text>
                      </View>
                    )
                  }}
                />
              </View>
            )
          }

          return (<Text>Loading</Text>)
        }}
      />
    )
  }
}
