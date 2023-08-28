import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const GenericTextInput = ({placeholder,value,onChangeText}) => {
  return (
        <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus = {true}
        />
  )
}

export default GenericTextInput

const styles = StyleSheet.create({

    textInput:{
        width:"80%",
        borderWidth:1,
        padding:10,
        margin:10,
        borderRadius:5,
  
    }
})