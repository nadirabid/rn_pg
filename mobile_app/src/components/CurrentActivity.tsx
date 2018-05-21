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
import { DateTime, Duration, DurationObject } from 'luxon'

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
  numberContainer: {
    borderColor: '#000000',
    borderWidth: 0,
  },
  unitContainer: {
    borderColor: '#00ff00',
    borderWidth: 0,
    marginBottom: 9,
  },
  number: {
    fontSize: 70,
    fontFamily: 'Oswald-Regular',
  },
  unit: {
    fontSize: 20,
    fontFamily: 'System',
  },
})

interface Props {}
interface State {
  startTime: DateTime,
  duration: DurationObject
}

export default function(environment: Environment) {
  return class CurrentActivity extends Component<Props, State> {
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

    intervalId: number = 0

    componentDidMount() {
      const startTime = DateTime.local().minus({ minutes: 32 })
      const duration = startTime.diffNow().negate()

      this.setState({
        startTime: startTime,
        duration: duration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds').toObject()
      })

      this.intervalId = setInterval(() => {
        const duration = this.state.startTime.diffNow().negate()
        this.setState({ 
          duration: duration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds').toObject()
        })
      }, 1000)
    }

    componentWillUnmount() {
      clearInterval(this.intervalId)
    }

    get hours() {
      if (this.state.duration === undefined) {
        return '00'
      } else if (this.state.duration.hours < 10) {
        return `0${this.state.duration.hours}`
      }

      return this.state.duration.hours
    }

    get minutes() { 
      if (this.state.duration === undefined) {
        return '00'
      } else if (this.state.duration.minutes < 10) {
        return `0${this.state.duration.minutes}`
      }

      return this.state.duration.minutes
    }

    get seconds() {
      if (this.state.duration === undefined) {
        return '00'
      } else if (this.state.duration.seconds < 10) {
        return `0${this.state.duration.seconds}`
      }

      return this.state.duration.seconds
    }

    get timer() {
      return (
        <View style={currentActivityStyles.timer}>
          <Text>
            <View style={timerStyles.numberContainer}>
              <Text style={timerStyles.number}>{this.hours}</Text>
            </View>
            <View style={timerStyles.unitContainer}>
              <Text style={timerStyles.unit}>h</Text>
            </View>
            <View style={timerStyles.numberContainer}>
              <Text style={timerStyles.number}>{this.minutes}</Text>
            </View>
            <View style={timerStyles.unitContainer}>
              <Text style={timerStyles.unit}>m</Text>
            </View>
            <View style={timerStyles.numberContainer}>
              <Text style={timerStyles.number}>{this.seconds}</Text>
            </View>
            <View style={timerStyles.unitContainer}>
              <Text style={timerStyles.unit}>s</Text>
            </View>
          </Text>
        </View>
      )
    }

    render() {
      return (
        <View style={currentActivityStyles.container}>
          <View style={currentActivityStyles.data}>
            {this.timer}
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
