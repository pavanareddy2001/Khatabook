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
    justifyContent: 'center',
    borderBottomWidth:0.4,
    borderColor:"white"
  },
  backBtn: {
    position:"absolute",
    left: 10
  },
  backArrowImg: {
    width: 25,
    height: 25,
    tintColor: 'white',
    left: 0
    //  zIndex:4
  },
  headerTitleStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight:"700"
    // padding: 10,
    // position:"absolute",
    //  textAlign:"center",
    //  width:"100%",
    //  zIndex:1
  },
});
