import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const GenericButton = ({buttonName, onPressAction=()=>{}, buttonStyle = {}}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPressAction();
      }}
      style={[styles.button, buttonStyle]}>
      <Text style={styles.text}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

export default GenericButton;

const styles = StyleSheet.create({
  button: {
    width: '80%',
    backgroundColor: 'blue',
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});
