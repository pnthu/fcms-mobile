import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './Router';

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );
  }
}

export default App;
