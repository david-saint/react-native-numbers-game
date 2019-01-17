/* eslint-disable */

import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  random: {
    color: '#808080',
    backgroundColor: '#e9e9e9',
    width: 100,
    marginHorizontal: 25,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
    borderRadius: 0
  },

  selected: {
    opacity: 0.5,
  }
});

class RandomNumber extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  handlePress = () => {
    if (!this.props.isDisabled)
      this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.random, this.props.isDisabled && styles.selected]}>{this.props.number}</Text>
      </TouchableOpacity>
    );
  }
}

export default RandomNumber;
