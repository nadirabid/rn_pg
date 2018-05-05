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

const activityListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: 'System',
  },
  sub: {
    fontSize: 5,
    fontFamily: 'System',
  },
})

interface ActivityListItemProps {
  id: string
}

class ActivityListItem extends Component<ActivityListItemProps> {
  render() {
    return (
      <View style={activityListItemStyles.container}>
        <Text style={activityListItemStyles.title}>Nadir Muzaffar</Text>
        <Text style={activityListItemStyles.sub}>{this.props.id}</Text>
      </View>
    )
  }
}

// ActivitesFeed component

const query = graphql`
query ActivitiesFeed_Query {
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

const activitiesFeedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: '#eee',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: '9%',
  },
})

export default function(environment: Environment) {
  return class ActivitiesFeed extends Component {
    render() {
      return (
        <QueryRenderer
          environment={environment}
          query={query}
          variables={{}}
          render={({error, props}) => {
            const activities: any[] = get(props, 'me.getActivities.edges', [])
            
            if (error) {
              return (<Text>{error.message}</Text>)
            } else if (props) {
              return (
                <View style={activitiesFeedStyles.container}>
                  <Text style={activitiesFeedStyles.welcome}>Ryden</Text>
                  <FlatList
                    style={activitiesFeedStyles.list}
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
