import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericTextInput from '../Components/GenericTextInput';
import GenericButton from '../Components/GenericButton';
import CustomHeader from '../Components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {showToast} from '../utils';
import {BOOK} from '../Images';
var db = openDatabase({name: 'UserDatabase.db'});

const Login = props => {
  const {navigation} = props;
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState([]);
  const [loginData, setLoginData] = useState({
    UserLoginId: '1',
    UserPassword: '1',
  });
  const getLoginData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from UserDetails',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getLoginData', temp);
            onSuccess(temp);
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getLoginData', error);
      onFailure(error);
    }
  };
  useEffect(() => {
    getLoginData(data => {
      setUserData(data);
    });
  }, [isFocused]);

  return (
    <View style={styles.mainView}>
      {/* <CustomHeader
        backArrowShow={false}
        headerTitle={'Login'}
        navigation={navigation}
      /> */}
      <ScrollView contentContainerStyle={styles.mainView}>
        <Image style={{height: 100, width: 100, marginTop: 26}} source={BOOK} />
        <Text style={styles.appName}>Welcome To KhathaBook</Text>
        <GenericTextInput
          title={'Login Id'}
          placeholder={'Enter your login id'}
          value={loginData.UserLoginId}
          onChangeText={value => {
            setLoginData({
              ...loginData,
              UserLoginId: value,
            });
          }}
        />
        <GenericTextInput
          title={'Password'}
          placeholder={'Enter your password'}
          value={loginData.UserPassword}
          onChangeText={value => {
            setLoginData({
              ...loginData,
              UserPassword: value,
            });
          }}
        />
        <GenericButton
          buttonName={'LOGIN'}
          buttonStyle={{marginTop: 40}}
          onPressAction={() => {
            if (loginData.UserLoginId && loginData.UserPassword) {
              let isUserPresent = userData.find(
                item =>
                  item.UserLoginId.toString() ===
                  loginData.UserLoginId.toString(),
              );
              if (isUserPresent === undefined) {
                showToast({mainText: 'User not registered', type: 'error'});
              } else {
                if (
                  isUserPresent.UserPassword.toString() ===
                  loginData.UserPassword.toString()
                ) {
                  navigation.navigate('MyTabs');
                } else {
                  showToast({mainText: 'Wrong password', type: 'error'});
                }
              }
              console.log('====================================');
              console.log('isUserPresent', isUserPresent, userData);
              console.log('====================================');
            } else {
              showToast({mainText: 'All Fields Requried...', type: 'error'});
            }
          }}
        />
        <Text style={styles.orTxt}>or</Text>
        <GenericButton
          buttonStyle={{
            backgroundColor: 'white',
            borderWidth: 0.6,
            borderColor: 'blue',
          }}
          textStyle={{color: 'blue'}}
          buttonName={'Dont have an account? Sign Up'}
          onPressAction={() => {
            navigation.navigate('SignUp', userData);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainView: {
    //  width:"100%",
    // height:"100%",
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('screen').width,
  },
  appName: {
    fontSize: 18,
    color: 'blue',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 40,
  },
  orTxt: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '400',
  },
});
