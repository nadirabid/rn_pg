import React, { 
  Component,
  ReactNode,
} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableNativeFeedback,
  Platform,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { isEqual } from 'lodash'

const styles = StyleSheet.create({
  button: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textButton: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  spinner: {
    alignSelf: 'center',
  },
  opacity: {
    opacity: 0.5,
  },
});

interface Props {
  style: StyleProp<ViewStyle>
  textStyle: StyleProp<TextStyle>
  disabledStyle: StyleProp<TextStyle>
  children: ReactNode[]
  testID: string
  accessibilityLabel: string
  activeOpacity: number
  allowFontScaling: boolean
  isLoading: boolean
  isDisabled: boolean
  activityIndicatorColor: string
  delayLongPress: number
  delayPressIn: number
  delayPressOut: number
  onPress: (GestureResponderEvent) => void
  onLongPress: (GestureResponderEvent) => void
  onPressIn: (GestureResponderEvent) => void
  onPressOut: (GestureResponderEvent) => void
  background: any
}

class Button extends Component<Props> {
  get children() {
    let childElements: ReactNode[] = []

    React.Children.forEach(this.props.children, (item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const element = (
          <Text
            style={[styles.textButton, this.props.textStyle]}
            allowFontScaling={this.props.allowFontScaling}
            key={item}
          >
            {item}
          </Text>
        )
        childElements.push(element)
      } else if (React.isValidElement(item)) {
        childElements.push(item);
      }
    })

    return (childElements)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps, this.props)) {
      return true
    }
    return false
  }

  get innerText() {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator
          animating={true}
          size='small'
          style={styles.spinner}
          color={this.props.activityIndicatorColor || 'black'}
        />
      )
    }
    return this.children
  }

  render() {
    if (this.props.isDisabled === true || this.props.isLoading === true) {
      return (
        <View style={[styles.button, this.props.style, (this.props.disabledStyle || styles.opacity)]}>
          {this.innerText}
        </View>
      )
    }

    // Extract Touchable props
    let touchableProps = {
      testID: this.props.testID,
      accessibilityLabel: this.props.accessibilityLabel,
      onPress: this.props.onPress,
      onPressIn: this.props.onPressIn,
      onPressOut: this.props.onPressOut,
      onLongPress: this.props.onLongPress,
      activeOpacity: this.props.activeOpacity,
      delayLongPress: this.props.delayLongPress,
      delayPressIn: this.props.delayPressIn,
      delayPressOut: this.props.delayPressOut,
    }

    return (
      <TouchableOpacity 
        {...touchableProps}
        style={[styles.button, this.props.style]}
      >
        {this.innerText}
      </TouchableOpacity>
    )
  }
}
