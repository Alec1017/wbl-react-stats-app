import { AppRegistry } from 'react-native'

import AppWithStore from './App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppWithStore)
