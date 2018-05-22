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

import Button from './Button'

const currentActivityStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  data: {
    flex: 1,
    backgroundColor: 'white',
  },
  controls: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 120,
  },
})

const timerButtonStyles = StyleSheet.create({
  button: {
    marginBottom: 20,
    width: 80,
    height: 80,
    borderRadius: 100,
  },
})

const timerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 150,
  },
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
  currentDurationSegment: Duration,
  duration: Duration,
  startTime?: DateTime,
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
      currentDurationSegment: Duration.fromMillis(0),
      duration: Duration.fromMillis(0),
      startTime: undefined,
    }

    intervalId?: number = 0

    componentWillUnmount() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
    }

    handleStartTimer = (GestureResponderEvent) => {
      const startTime = DateTime.local()
      const duration = startTime.diffNow().negate()

      this.setState({
        startTime: startTime,
      })

      this.intervalId = setInterval(() => {
        this.setState({
          currentDurationSegment: this.state.startTime.diffNow().negate()
        })
      }, 1000)
    }

    handlePauseTimer = (GestureResponderEvent) => {
      clearInterval(this.intervalId)
      this.intervalId = undefined

      this.setState((prevState) => {
        return {
          currentDurationSegment: Duration.fromMillis(0),
          duration: prevState.duration.plus(prevState.currentDurationSegment),
          startTime: undefined,
        }
      })
    }

    handleCancelTimer = () => {
      clearInterval(this.intervalId)
      this.intervalId = undefined

      this.setState({
        currentDurationSegment: Duration.fromMillis(0),
        duration: Duration.fromMillis(0),
        startTime: undefined,
      })
    }

    get totalDurationObject(): Duration {
      const totalDuration = this.state.duration.plus(this.state.currentDurationSegment)
      return totalDuration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds')
    }

    get hours() {
      const hours = this.totalDurationObject.toObject().hours

      if (hours < 10) {
        return `0${hours}`
      }

      return hours
    }

    get minutes() {
      const minutes = this.totalDurationObject.toObject().minutes

      if (minutes < 10) {
        return `0${minutes}`
      }

      return minutes
    }

    get seconds() {
      const seconds = this.totalDurationObject.toObject().seconds

      if (seconds < 10) {
        return `0${seconds}`
      }

      return seconds
    }

    get timer() {
      return (
        <View style={timerStyles.container}>
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

    get timerButton() {
      if (this.totalDurationObject.milliseconds === 0 && this.state.startTime === undefined) {
        return (
          <Button 
            style={timerButtonStyles.button}
            onPress={this.handleStartTimer}
          >
            Start
          </Button>
        )
      } else if (this.state.startTime === undefined) {
        return (
          <Button 
            style={timerButtonStyles.button}
            onPress={this.handleStartTimer}
          >
            Resume
          </Button>
        )
      }

      return (
        <Button 
          style={timerButtonStyles.button}
          onPress={this.handlePauseTimer}
        >
          Pause
        </Button>
      )
    }

    get cancelButton() {
      return (
        <Button 
          style={timerButtonStyles.button}
          onPress={this.handleCancelTimer}
        >
          Cancel
        </Button>
      )
    }

    render() {
      return (
        <View style={currentActivityStyles.container}>
          <View style={currentActivityStyles.data}>
            {this.timer}
          </View>
          <View style={currentActivityStyles.controls}>
            {this.cancelButton}
            {this.timerButton}
          </View>
        </View>
      )
    }
  }
}
