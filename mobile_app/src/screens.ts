import { Navigation } from 'react-native-navigation'
import { Environment } from 'relay-runtime';

import activitiesFeed from './components/ActivitiesFeed'
import currentActivity from './components/CurrentActivity'

export default function registerScreens(environment: Environment) {
  Navigation.registerComponent('ryden.ActivitiesFeed', () => activitiesFeed(environment))
  Navigation.registerComponent('ryden.CurrentActivity', () => currentActivity(environment))
}
