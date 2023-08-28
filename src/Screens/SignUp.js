import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GenericTextInput from '../Components/GenericTextInput';
import GenericButton from '../Components/GenericButton';
import CustomHeader from '../Components/CustomHeader';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

const SignUp = props => {
  const {navigation} = props;
  // const [signUpData, setSignUpData] = useState(props.route.params)
  console.log('====================================');
  console.log('signupprops', props.route.params);
  console.log('====================================');
  const [signUpDetails, setSignUpDetails] = useState({
    UserName: '',
    UserLoginId: '',
    UserPassword: '',
    MobileNumber: '',
  });
  async function insertIntoUser(onSuccess = () => {}, onFailure = error => {}) {
    try {
      await db.transaction(async tx => {
        await tx.executeSql(
          'insert into UserDetails ' +
            '(UserName,UserLoginId,UserPassword,MobileNumber) values(?,?,?,?)',
          [
            signUpDetails.UserName,
            signUpDetails.UserLoginId,
            signUpDetails.UserPassword,
            signUpDetails.MobileNumber,
          ],
          (tx, results) => {
            console.log('insertIntoUser', results);
            if (results?.rowsAffected === 1) {
              onSuccess();
            } else {
              onFailure(results?.message);
            }
          },
          error => {
            console.log('insertIntoUser Failed', error);
            onFailure(results?.message);
          },
        );
      });
    } catch (error) {
      console.log('error', error);
      onFailure(error);
    }
  }
  return (
    <View style={styles.mainView}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={'Sign up'}
        navigation={navigation}
      />
      <GenericTextInput
        placeholder={'Enter your name'}
        value={signUpDetails.UserName}
        onChangeText={value => {
          setSignUpDetails({
            ...signUpDetails,
            UserName: value,
          });
        }}
      />
      <GenericTextInput
        placeholder={'Mobile Number'}
        value={signUpDetails.MobileNumber}
        onChangeText={value => {
          setSignUpDetails({
            ...signUpDetails,
            MobileNumber: value,
          });
        }}
      />
      <GenericTextInput
        placeholder={'Login ID'}
        value={signUpDetails.UserLoginId}
        onChangeText={value => {
          setSignUpDetails({
            ...signUpDetails,
            UserLoginId: value,
          });
        }}
      />
      <GenericTextInput
        placeholder={'Create a password'}
        value={signUpDetails.UserPassword}
        onChangeText={value => {
          setSignUpDetails({
            ...signUpDetails,
            UserPassword: value,
          });
        }}
      />

      <GenericButton
        buttonName={'Sign Up'}
        onPressAction={() => {
          if (
            signUpDetails.MobileNumber &&
            signUpDetails.UserLoginId &&
            signUpDetails.UserName &&
            signUpDetails.UserPassword
          ) {
            let isLoginIdPresent = props.route.params.find(item => {
              return (
                item.UserLoginId.toString() ===
                signUpDetails.UserLoginId.toString()
              );
            });
            let isLoginMobileNoPresent = props.route.params.find(item => {
              return (
                item.MobileNumber.toString() ===
                signUpDetails.MobileNumber.toString()
              );
            });
            if (
              isLoginIdPresent === undefined &&
              isLoginMobileNoPresent === undefined
            ) {
              insertIntoUser(() => {
                Alert.alert('SignUp successful');
                navigation.goBack();
              });
            }
            if (isLoginMobileNoPresent) {
              Alert.alert('Error', 'mobile number already existing');
            }
            if (isLoginIdPresent) {
              Alert.alert('Error', 'existing user');
            }

            console.log('====================================');
            console.log('isLoginIdPresent', isLoginIdPresent);
            console.log('====================================');
          }
        }}
      />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
  },
});
