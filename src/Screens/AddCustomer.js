import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GenericTextInput from "../Components/GenericTextInput";
import CustomHeader from "../Components/CustomHeader";
import { openDatabase } from "react-native-sqlite-storage";
import GenericButton from "../Components/GenericButton";
import { useSelector } from "react-redux";
import { getOnlyNumbers, showToast } from "../utils";

var db = openDatabase({ name: "UserDatabase.db" });
const AddCustomer = (props) => {
  const { navigation } = props;
  const [customerDetails, setCustomerDetails] = useState({
    CustomerName: "",
    CustomerMobileNumber: "",
    CustomerGSTIN: "",
    FlatBuiding: "",
    AddressArea: "",
    Pincode: "",
    City: "",
    State: "",
  });
  const [customerErrorMsg, setCustomerErrorMsg] = useState({
    CustomerName: "",
    CustomerMobileNumber: "",
  });
  const [showGstView, setShowGstView] = useState(false);
  const reduxData = useSelector((data) => data);
  async function insertIntoCustomer(
    onSuccess = () => {},
    onFailure = (error) => {}
  ) {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Customer " +
            "(BusinessId,CustomerName,CustomerMobileNumber,CustomerGSTIN,FlatBuiding,AddressArea,Pincode,City,State) values(?,?,?,?,?,?,?,?,?)",
          [
            reduxData.BusinessData.BusinessId,
            customerDetails.CustomerName,
            customerDetails.CustomerMobileNumber,
            customerDetails.CustomerGSTIN,
            customerDetails.FlatBuiding,
            customerDetails.AddressArea,
            customerDetails.Pincode,
            customerDetails.City,
            customerDetails.State,
          ],
          (tx, results) => {
            console.log("insertIntoCustomer", results);
            if (results?.rowsAffected === 1) {
              onSuccess();
            } else {
              onFailure(results?.message);
            }
          },
          (error) => {
            console.log("insertIntoCustomer Failed", error);
            onFailure(results?.message);
          }
        );
      });
    } catch (error) {
      console.log("error"), error;
      onFailure(error);
    }
  }

  const getCustomerData = async (
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from Customer",
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log("getCustomer", temp);
            onSuccess(temp);
          },
          (err) => {
            onFailure(err);
          }
        );
      });
    } catch (error) {
      console.log("getCustomerData", error);
      onFailure(error);
    }
  };
  function isValidFields() {
    let isValid = true;
    let customerError = "";
    let mobileError = "";
    if (customerDetails.CustomerName === "") {
      isValid = false;
      customerError = "Enter Party Name";
    }
    if (customerDetails.CustomerMobileNumber === "") {
      isValid = false;
      mobileError = "Enter Mobile Number";
    }
    const isValidInput = /^[6-9][0-9]{9}$/.test(customerDetails.CustomerMobileNumber);
    console.log('isValidInput', isValidInput, customerDetails.CustomerMobileNumber);
    if (!isValidInput) {
      isValid = false;
      mobileError = "Enter 10 Digit Number, Start from 6-9";
    }
    setCustomerErrorMsg({
      CustomerName: customerError,
      CustomerMobileNumber: mobileError,
    });
    return isValid;
  }
  useEffect(() => {
    if (customerDetails?.CustomerMobileNumber !== '') {
      isValidFields()
    }
    
  }, [customerDetails?.CustomerMobileNumber]);

  function onPressAddCustomer() {
    if (!isValidFields()) {
      return;
    }
    insertIntoCustomer(() => {
     showToast({mainText:"Customer added Successfully"})
      getCustomerData();
      setCustomerDetails({
        CustomerName: "",
        CustomerMobileNumber: "",
        CustomerGSTIN: "",
        FlatBuiding: "",
        AddressArea: "",
        Pincode: "",
        City: "",
        State: "",
      });
      setCustomerErrorMsg({
        CustomerName: '',
        CustomerMobileNumber: ''
      })
      navigation.navigate("Home");
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={"Add Customer"}
        navigation={navigation}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <GenericTextInput
            placeholder={"Party name"}
            value={customerDetails.CustomerName}
            onChangeText={(value) =>
              setCustomerDetails({
                ...customerDetails,
                CustomerName: value,
              })
            }
          />
          {customerErrorMsg?.CustomerName &&
            customerDetails.CustomerName === "" && (
              <Text style={styles.errorMsg}>
                {customerErrorMsg?.CustomerName}
              </Text>
            )}
          <GenericTextInput
            placeholder={"Mobile Number"}
            value={customerDetails.CustomerMobileNumber}
            onChangeText={(value) =>
              setCustomerDetails({
                ...customerDetails,
                CustomerMobileNumber: getOnlyNumbers(value),
              })
            }
            keyboardType={"number-pad"}
          />
          {customerErrorMsg?.CustomerMobileNumber && (
            <Text style={styles.errorMsg}>
              {customerErrorMsg?.CustomerMobileNumber}
            </Text>
          )}
          <TouchableOpacity
            style={{ marginVertical: 12 }}
            onPress={() => {
              setShowGstView(!showGstView);
            }}
          >
            <Text style={{ color: "blue" }}>
              +ADD GSTIN & ADDRESS(OPTIONAL)
            </Text>
          </TouchableOpacity>
          {showGstView ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <GenericTextInput
                placeholder={"GSTIN"}
                value={customerDetails.CustomerGSTIN}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    CustomerGSTIN: value,
                  })
                }
              />

              <GenericTextInput
                placeholder={"Flat / Building Number"}
                value={customerDetails.FlatBuiding}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    FlatBuiding: value,
                  })
                }
              />

              <GenericTextInput
                placeholder={"Area / Locality"}
                value={customerDetails.AddressArea}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    AddressArea: value,
                  })
                }
              />
              <GenericTextInput
                placeholder={"Pincode"}
                value={customerDetails.Pincode}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    Pincode: value,
                  })
                }
              />
              <GenericTextInput
                placeholder={"City"}
                value={customerDetails.City}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    City: value,
                  })
                }
              />
              <GenericTextInput
                placeholder={"State"}
                value={customerDetails.State}
                onChangeText={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    State: value,
                  })
                }
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <GenericButton
        buttonStyle={{ alignSelf: "center" }}
        buttonName={"ADD"}
        onPressAction={() => {
          onPressAddCustomer();
        }}
      />
    </View>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  errorMsg: {
    fontSize: 10,
    width: "80%",
    color: "red",
    marginBottom: 6,
    marginTop: -5,
  },
});
