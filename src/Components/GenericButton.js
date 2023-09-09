import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const GenericButton = ({buttonName, onPressAction=()=>{}, buttonStyle = {}, textStyle= {}, icon, iconStyle = {}}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        onPressAction();
      }}
      style={[styles.button, buttonStyle]}>
        {icon ? <Image  style={[{ height: 20, width: 20,}, iconStyle]} source={icon} /> : null}
      <Text style={[styles.text, textStyle]}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

export default GenericButton;

const styles = StyleSheet.create({
  button: {
    width: '80%',
    backgroundColor: 'blue',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize:14,
    fontWeight:"600"
  },
});
