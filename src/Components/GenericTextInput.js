import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const GenericTextInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  title = '',
  autoFocus
}) => {
  return (
    <View style={{marginVertical: 12, width: '80%', marginHorizontal: 10}}>
      {title ? <Text style={styles.titleTxt}>{title}</Text> : <View style={{height: 10}} />}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default GenericTextInput;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
  titleTxt: {
    width: '100%',
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    marginBottom: 8
  },
});
