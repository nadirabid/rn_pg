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
    backgroundColor: 'steelblue',
    alignItems: 'stretch',
  },
  data: {
    flex: 1,
    backgroundColor: 'white',
  },
  timer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    height: 50,
    backgroundColor: 'powderblue',
  },
})

const timerStyles = StyleSheet.create({
  text: {
    fontSize: 30
  }
})

export default function(environment: Environment) {
  return class CurrentActivity extends Component {
    static navigatorStyle = {
      navBarTranslucent: true,
      drawUnderNavBar: false,
      statusBarTextColorScheme: 'light',
      drawUnderTabBar: false,
      navBarBackgroundColor: 'white',
    };

    render() {
      return (
        <View style={currentActivityStyles.container}>
          <View style={currentActivityStyles.data}>
            <View style={currentActivityStyles.timer}>
              <Text style={timerStyles.text}>00h00m00s</Text>
            </View>
            <View>
              <View><Text>Heart</Text></View>
            </View>
          </View>
          <View style={currentActivityStyles.controls}>
            <Text>Start</Text>
          </View>
        </View>
      )
    }
  }
}
