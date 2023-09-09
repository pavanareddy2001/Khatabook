import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const GenericTextInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
}) => {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      autoFocus={true}
      keyboardType={keyboardType}
    />
  );
};

export default GenericTextInput;

const styles = StyleSheet.create({
  textInput: {
    width: "80%",
    borderWidth: 0.5,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
});
