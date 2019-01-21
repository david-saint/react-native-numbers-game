import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';
import shuffle from 'lodash.shuffle';

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
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  statsContainer: {
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
    margin: 20,
  },
});

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
    onGameWon: PropTypes.func.isRequired,
    score: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = 'PLAYING';

  score = 0;

  randomNumbers = Array.from({
    length: this.props.randomNumberCount,
  }).map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2).reduce((a, c) => a + c, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    const { remainingSeconds } = this.state;

    this.intervalId = setInterval(() => {
      this.setState(prevState => ({
        remainingSeconds: prevState.remainingSeconds - 1,
      }), () => {
        if (remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUpdate(nextProps, nextState) {
    const { selectedIds } = this.state;

    if (selectedIds !== nextState.selecetedIds || nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = numberIndex => this.state.selectedIds.indexOf(numberIndex) >= 0;

  selectNumber = (numberIndex) => {
    const { onGameWon } = this.props;

    this.setState(({ selectedIds }) => ({
      selectedIds: [...selectedIds, numberIndex],
    }), () => {
      if (this.gameStatus === 'WON') {
        onGameWon();
      }
    });
  };

  // TODO: Shuffle the random numbers

  calcGameStatus = ({ selectedIds, remainingSeconds }) => {
    const sumSelected = selectedIds.reduce((a, c) => a + this.shuffledRandomNumbers[c], 0);

    if (remainingSeconds === 0) {
      return 'LOST';
    }

    if (sumSelected < this.target) {
      return 'PLAYING';
    }

    if (sumSelected > this.target) {
      return 'LOST';
    }

    return 'WON';
  };

  render() {
    const gs = this.gameStatus;
    const { remainingSeconds } = this.state;
    const { id, score, onPlayAgain } = this.props;

    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gs}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((r, i) => (
            <RandomNumber
              key={i}
              id={i}
              number={r}
              isDisabled={this.isNumberSelected(i) || gs !== 'PLAYING'}
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {gs !== 'PLAYING' && (
          <Button
            title="Play Again!"
            color="#95B8D1"
            onPress={onPlayAgain}
          />
        )}
        <View style={styles.randomContainer}>
          <Text style={styles.m20}>{remainingSeconds}</Text>
          <Text style={styles.m20}>{`${score}/${id}`}</Text>
        </View>
      </View>
    );
  }
}

export default Game;
