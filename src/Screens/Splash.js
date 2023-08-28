import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Splash = () => {
  return (
    <View style={styles.mainView}>

      <Image
      style={styles.image}
      source={require("../Images/book.png")}
      
      />
       <Text style={styles.text}>KHATABOOK</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    mainView:{
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
    },
    text:{
        fontSize:30,
        color:"black",
        fontWeight:"bold"
    },
    image:{
        width:200,
        height:200,
        borderRadius:5
    }
})