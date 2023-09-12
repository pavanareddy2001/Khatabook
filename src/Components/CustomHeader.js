import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { BACKARROW } from '../Images';

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
            source={BACKARROW}
          />
        </TouchableOpacity>
      ) : null}
      <Text numberOfLines={1} style={styles.headerTitleStyle}>{headerTitle}</Text>
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
  },
  headerTitleStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight:"700",
    width: '80%',
    textAlign: 'center'
  },
});
