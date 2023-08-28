import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const CustomHeader = ({headerTitle, navigation, backArrowShow}) => {
  return (
    <View style={styles.mainView}>
      {backArrowShow ? (
        <TouchableOpacity
        style={styles.backBtn}
          onPress={() => {
            navigation?.goBack();
          }}>
          <Image
            style={styles.backArrowImg}
            source={require('../Images/backArrow.png')}
          />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.headerTitleStyle}>{headerTitle}</Text>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  mainView: {
    width:"100%",
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
    // marginBottom:10
    //position:'absolute'
    
  },
  backBtn: {
    position:"absolute",
    left: 16
  },
  backArrowImg: {
    width: 20,
    height: 20,
    tintColor: 'white',
    // position:"absolute",
    left: 0
    //  zIndex:4
  },
  headerTitleStyle: {
    fontSize: 16,
    color: 'white',
    // padding: 10,
    // position:"absolute",
    //  textAlign:"center",
    //  width:"100%",
    //  zIndex:1
  },
});
