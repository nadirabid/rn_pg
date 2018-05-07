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
    paddingBottom: 150,
  },
  controls: {
    height: 50,
    backgroundColor: 'powderblue',
  },
})

const timerStyles = StyleSheet.create({
  number: {
    fontSize: 60,
    fontFamily: 'Oswald-Regular',
  },
  unit: {
    fontSize: 20,
    fontFamily: 'System',
  },
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

    get hours() {
      return '00'
    }

    get minutes() {
      return '27'
    }

    get seconds() {
      return '56'
    }

    get timer() {
      return (
        <Text>
          <Text style={timerStyles.number}>{this.hours}</Text>
          <Text style={timerStyles.unit}>h</Text>
          <Text style={timerStyles.number}>{this.minutes}</Text>
          <Text style={timerStyles.unit}>m</Text>
          <Text style={timerStyles.number}>{this.seconds}</Text>
          <Text style={timerStyles.unit}>s</Text>
        </Text>
      )
    }

    render() {
      return (
        <View style={currentActivityStyles.container}>
          <View style={currentActivityStyles.data}>
            <View style={currentActivityStyles.timer}>
              <Text style={timerStyles.text}>
                {this.timer}
              </Text>
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
