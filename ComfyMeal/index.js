/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App/App';
import {name} from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(name, () => App);
