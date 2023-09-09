import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericTextInput from '../Components/GenericTextInput';
import GenericButton from '../Components/GenericButton';
import CustomHeader from '../Components/CustomHeader';
import { useIsFocused } from "@react-navigation/native";
import {openDatabase} from 'react-native-sqlite-storage';
import { showToast } from '../utils';
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
      <CustomHeader
        backArrowShow={false}
        headerTitle={'Login'}
        navigation={navigation}
      />
      <GenericTextInput
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
        buttonName={'Login'}
        onPressAction={() => {
          if (loginData.UserLoginId && loginData.UserPassword) {
            let isUserPresent = userData.find(
              item => item.UserLoginId.toString() === loginData.UserLoginId.toString(),
            );
            if(isUserPresent===undefined){
              showToast({mainText:"User not registered",type:"error"})
            }else{
              if(isUserPresent.UserPassword.toString()===loginData.UserPassword.toString()){
                navigation.navigate("MyTabs")
              }else{
                showToast({mainText:"Wrong password",type:"error"})
              }
            }
            console.log('====================================');
            console.log('isUserPresent', isUserPresent,userData);
            console.log('====================================');
          }
        }}
      />
      <GenericButton
        buttonName={'Dont have an account? Sign Up'}
        onPressAction={() => {
          navigation.navigate('SignUp',userData);
        }}
      />
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
  },
});
