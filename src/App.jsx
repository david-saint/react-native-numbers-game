/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Game from './components/Game';

class App extends Component {
  state = {
    score: 0,
    gameId: 1,
  };

  numberOfGames = 10;

  resetGame = () => {
    this.setState(prevState => ({
      score: prevState.gameId < this.numberOfGames ? prevState.score : 0,
      gameId: prevState.gameId < this.numberOfGames ? prevState.gameId + 1 : 0,
    }));
  };

  increaseScore = () => {
    this.setState(prevState => ({
      score: prevState.score + 1,
    }));
  }

  render() {
    const { gameId, score } = this.state;

    return (
      <Game
        key={gameId}
        id={gameId}
        score={score}
        randomNumberCount={6}
        initialSeconds={10}
        onPlayAgain={this.resetGame}
        onGameWon={this.increaseScore}
      />
    );
  }
}

export default App;
