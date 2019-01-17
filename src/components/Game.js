/* eslint-disable */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import PropTypes from 'prop-types';

import RandomNumber from './RandomNumber';

const pt = Platform.select({
  ios: 45,
  android: 10,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4C4',
    paddingTop: pt,
  },

  target: {
    fontSize: 50,
    marginHorizontal: 50,
    marginVertical: 20,
    textAlign: 'center',
  },

  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor: '#f0f8ff',
    color: '#808080',
  },

  STATUS_WON: {
    backgroundColor: '#008080',
    color: '#FFFFFF',
  },

  STATUS_LOST: {
    backgroundColor: '#ff6347',
    color: '#FFFFFF',
  },

  m20: {
    margin: 20
  }
});

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds
  };

  gameStatus = 'PLAYING';
  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2).reduce((a, c) => a + c, 0);
  // TODO: Shuffle the random numbers
  
  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  }

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex] 
    }))
  };

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((a, c) => {
      return a + this.randomNumbers[c];
    }, 0);

    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }

    if (sumSelected < this.target)
      return 'PLAYING';

    if (sumSelected > this.target)
      return 'LOST';

    return 'WON';
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1 };
      }, () => {
        if (this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedIds !== nextState.selecetedIds || nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING')
        clearInterval(this.intervalId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.randomNumbers.map((r, i) => 
            <RandomNumber 
              key={i}
              id={i}
              number={r}
              isDisabled={this.isNumberSelected(i) || gameStatus !== 'PLAYING'}
              onPress={this.selectNumber}
             />
          )}
        </View>
        <Text style={styles.m20}>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

export default Game;