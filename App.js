/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
/* eslint-disable */

import React, { Component } from 'react';
import Game from './src/components/Game';

class App extends Component {
  render() {
    return (
      <Game
        randomNumberCount={6}
        initialSeconds={10}
      />
    );
  }
}

export default App;
