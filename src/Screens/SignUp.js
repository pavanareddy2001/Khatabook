import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import GenericTextInput from "../Components/GenericTextInput";
import GenericButton from "../Components/GenericButton";
import CustomHeader from "../Components/CustomHeader";
import { openDatabase } from "react-native-sqlite-storage";
import { getOnlyNumbers, showToast } from "../utils";
import { BOOK } from "../Images";
var db = openDatabase({ name: "UserDatabase.db" });

const SignUp = (props) => {
  const { navigation } = props;
  // const [signUpData, setSignUpData] = useState(props.route.params)
  console.log("====================================");
  console.log("signupprops", props.route.params);
  console.log("====================================");
  const [signUpDetails, setSignUpDetails] = useState({
    UserName: "",
    UserLoginId: "",
    UserPassword: "",
    MobileNumber: "",
  });
  const [signUpErrorMsg, setSignUpErrorMsg] = useState({
    UserName: "",
    UserLoginId: "",
    UserPassword: "",
    MobileNumber: "",
  });
  function validSignUpFields() {
    let isValid = true;
    let userNameErr = "";
    let mobileError = "";
    let loginIdErr = "";
    let passwordErr = "";

    if (signUpDetails.UserName === "") {
      isValid = false;
      userNameErr = "Please enter your name";
    }
    if (signUpDetails.MobileNumber === "") {
      isValid = false;
      mobileError = "Please enter valid mobile no";
    }
    if (signUpDetails.UserLoginId === "") {
      isValid = false;
      loginIdErr = "Please enter login id";
    }
    if (signUpDetails.UserPassword === "") {
      isValid = false;
      passwordErr = "Please enter valid password";
    }
    const isValidInput = /^[6-9][0-9]{9}$/.test(signUpDetails.MobileNumber);
    if(!isValidInput){
      isValid=false
      mobileError = "Enter valid 10 digit mobile no"
    }
    setSignUpErrorMsg({
      ...signUpErrorMsg,
      UserName: userNameErr,
      MobileNumber: mobileError,
      UserLoginId: loginIdErr,
      UserPassword: passwordErr,
    });

    return isValid;
  }
  useEffect(() => {
    if(signUpDetails.MobileNumber){
      validSignUpFields()
    }  
  }, [signUpDetails.MobileNumber])
  
  async function insertIntoUser(
    onSuccess = () => {},
    onFailure = (error) => {}
  ) {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into UserDetails " +
            "(UserName,UserLoginId,UserPassword,MobileNumber) values(?,?,?,?)",
          [
            signUpDetails.UserName,
            signUpDetails.UserLoginId,
            signUpDetails.UserPassword,
            signUpDetails.MobileNumber,
          ],
          (tx, results) => {
            console.log("insertIntoUser", results);
            if (results?.rowsAffected === 1) {
              onSuccess();
            } else {
              onFailure(results?.message);
            }
          },
          (error) => {
            console.log("insertIntoUser Failed", error);
            onFailure(results?.message);
          }
        );
      });
    } catch (error) {
      console.log("error", error);
      onFailure(error);
    }
  }
  return (
    <View style={styles.mainView}>
      {/* <CustomHeader
        backArrowShow={true}
        headerTitle={"Sign up"}
        navigation={navigation}
      /> */}
      <ScrollView style={{flex:1,width:"100%"}}
      contentContainerStyle={{alignItems:"center"}}
      >
        <Image style={{height: 100, width: 100, marginTop: 26}} source={BOOK} />
        <Text style={styles.appName}>Create Account in Khatabook </Text>
      <GenericTextInput
        title="Name"
        placeholder={"Enter your name"}
        value={signUpDetails.UserName}
        onChangeText={(value) => {
          setSignUpDetails({
            ...signUpDetails,
            UserName: value,
          });
        }}
      />
      {signUpErrorMsg.UserName && signUpDetails.UserName === "" && (
        <Text style={styles.errorMsg}>{signUpErrorMsg.UserName}</Text>
      )}
      <GenericTextInput
        title="Mobile Number"
        placeholder={"Mobile Number"}
        value={signUpDetails.MobileNumber}
        onChangeText={(value) => {
          setSignUpDetails({
            ...signUpDetails,
            MobileNumber: getOnlyNumbers(value),
          });
        }}
      />
      {signUpErrorMsg.MobileNumber && (
        <Text style={styles.errorMsg}>{signUpErrorMsg.MobileNumber}</Text>
      )}
      <GenericTextInput
        title="Login ID"
        placeholder={"Login ID"}
        value={signUpDetails.UserLoginId}
        onChangeText={(value) => {
          setSignUpDetails({
            ...signUpDetails,
            UserLoginId: value,
          });
        }}
      />
      {signUpErrorMsg.UserLoginId && signUpDetails.UserLoginId==="" && (
        <Text style={styles.errorMsg}>{signUpErrorMsg.UserLoginId}</Text>
      )}
      <GenericTextInput
        title="Password"
        placeholder={"Create a password"}
        value={signUpDetails.UserPassword}
        onChangeText={(value) => {
          setSignUpDetails({
            ...signUpDetails,
            UserPassword: value,
          });
        }}
      />
      {signUpErrorMsg.UserPassword && signUpDetails.UserPassword==="" && (
        <Text style={styles.errorMsg}>{signUpErrorMsg.UserPassword}</Text>
      )}

      <GenericButton
        buttonName={"SIGN UP"}
        buttonStyle={{marginTop: 30}}
        onPressAction={() => {
          if (!validSignUpFields()) {
            return;
          }
          if (
            signUpDetails.MobileNumber &&
            signUpDetails.UserLoginId &&
            signUpDetails.UserName &&
            signUpDetails.UserPassword
          ) {
            let isLoginIdPresent = props.route.params.find((item) => {
              return (
                item.UserLoginId.toString() ===
                signUpDetails.UserLoginId.toString()
              );
            });
            let isLoginMobileNoPresent = props.route.params.find((item) => {
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
                showToast({
                  mainText: "SignUp successful",
                  type: "success",
                });
                navigation.goBack();
              });
            }
            if (isLoginMobileNoPresent) {
              Alert.alert("Error", "mobile number already existing");
            }
            if (isLoginIdPresent) {
              Alert.alert("Error", "existing user");
            }

            console.log("====================================");
            console.log("isLoginIdPresent", isLoginIdPresent);
            console.log("====================================");
          }
        }}
      />
      <TouchableOpacity onPress={()=>props?.navigation?.goBack()}>
        <Text style={styles.alreadyHaveAcc}>Already have Account... Login Now</Text>
      </TouchableOpacity>
       </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
  },
  errorMsg: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    width:"80%"
  },
  appName: {
    fontSize: 18,
    color: 'blue',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 30,
  },
  alreadyHaveAcc: {
    fontSize: 14,
    color: 'coral',
    fontWeight: '700',
    marginTop: 16,
  }
});
