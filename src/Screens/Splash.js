import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BOOK} from '../Images';

const Splash = props => {
  const [scaleValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1, // Final scale value is 1 (100%)
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for performance
    }).start(); // Start the animation
  }, [scaleValue]);
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Login');
    }, 1200);
  }, []);
  return (
    <View style={styles.mainView}>
      <Animated.Image
        source={BOOK}
        style={{width: 150, height: 150, transform: [{scale: scaleValue}]}}
      />
      <Text style={styles.text}>Khatabook</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    color: 'blue',
    fontWeight: '700',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});
