import { Navigation } from 'react-native-navigation'
import { Environment } from 'relay-runtime';
import activitiesFeed from './ActivitiesFeed'

export default function registerScreens(environment: Environment) {
    Navigation.registerComponent('ryden.ActivitiesFeed', () => activitiesFeed(environment))
}
