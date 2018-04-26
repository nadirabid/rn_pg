import { Navigation } from 'react-native-navigation'
import { AppRegistry } from 'react-native'
import App, { Test } from './src/App'

// AppRegistry.registerComponent('mobile_app', () => App)
Navigation.registerComponent('app.main', () => App)

Navigation.startSingleScreenApp({
    screen: {
        screen: 'app.main'
    }
})
