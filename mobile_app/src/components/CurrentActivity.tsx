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
import moment from 'moment'
import { DateTime, Duration } from 'luxon'

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
    fontSize: 70,
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

    state = {
      startTime: undefined,
      duration: undefined,
    }

    intervalHandle = undefined

    componentDidMount() {
      const startTime = DateTime.local()
      const duration = DateTime.local().diff(startTime)

      this.setState({
        startTime: startTime,
        duration: duration
      })

      this.intervalHandle = setInterval(() => {
        const duration = DateTime.local().diff(this.state.startTime)
        this.setState({ 
          duration: duration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds').toObject()
        })
      }, 1000)
    }

    componentWillUnmount() {
      clearInterval(this.intervalHandle)
    }

    get hours() {
      if (this.state.duration === undefined) {
        return '00'
      }

      return this.state.duration.hours
    }

    get minutes() { 
      if (this.state.duration === undefined) {
        return '00'
      }

      return this.state.duration.minutes
    }

    get seconds() {
      if (this.state.duration === undefined) {
        return '00'
      }

      return this.state.duration.seconds
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
              {this.timer}
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
