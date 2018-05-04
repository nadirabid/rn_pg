import React, { Component } from 'react'
import {
  Text,
  FlatList,
  View,
  StyleSheet,
} from 'react-native'
import Config from 'react-native-config'
import {
  graphql,
  QueryRenderer,
} from 'react-relay'
import { Environment } from 'relay-runtime'
import { get } from 'lodash'

// ActivityListItem

interface ActivityListItemProps {
  id: string
}

const activityStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: 15,
    fontFamily: 'System'
  },
  sub: {
    fontSize: 5,
    fontFamily: 'System'
  }
})

class ActivityListItem extends Component<ActivityListItemProps> {
  render() {
    return (
      <View style={activityStyles.container}>
      <Text style={activityStyles.title}>Nadir Muzaffar</Text>
      <Text style={activityStyles.sub}>{this.props.id}</Text>
      </View>
    )
  }
}

// App component

interface Props {}
interface State {}

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
    flex: 1
  },
  list: {
    backgroundColor: '#eee'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: '9%',
  },
})

export default (environment: Environment) => {
  return class App extends Component<Props, State> {
    render() {
      return (
        <QueryRenderer
        environment={environment}
        query={appQuery}
        variables={{}}
        render={({error, props}) => {
          const activities: any[] = get(props, 'me.getActivities.edges', [])
          
          if (error) {
            return (<Text>{error.message}</Text>)
          } else if (props) {
            return (
              <View style={styles.container}>
              <Text style={styles.welcome}>Ryden</Text>
              <FlatList
              style={styles.list}
              keyExtractor={(item) => item.node.id}
              data={activities}
              renderItem={({ item }: { item: any }) => {
                return (
                  <ActivityListItem id={item.node.id} />
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
}
