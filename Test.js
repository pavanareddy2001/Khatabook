import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const test = () => {
    
        const handleStars = (lim) => {
            let arr = new Array(lim);
            for(let i=0; i<=lim; i++){
              let str = '';
              for(let j=-1; j<=i; j++){
                str += '*';
              }
              arr[i] = str;
            }
        
            return arr;
          }
   
  return (
    <View>
      <Text>test</Text>
    </View>
  )
}

export default test

const styles = StyleSheet.create({})