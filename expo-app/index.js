import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

// Suppress Hermes dev architecture warnings in Expo Go
LogBox.ignoreAllLogs(true);

import App from './App';

registerRootComponent(App);
