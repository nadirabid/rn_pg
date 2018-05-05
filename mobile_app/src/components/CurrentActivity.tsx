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

const currentActivityStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default function(environment: Environment) {
  return class CurrentActivity extends Component {
    render() {
      return (
        <View style={currentActivityStyles.container}>
          <View><Text>Timer</Text></View>
          <View>
            <View><Text>Heart</Text></View>
          </View>
          <View><Text>Start</Text><View>
        </View>
      )
    }
  }
}
