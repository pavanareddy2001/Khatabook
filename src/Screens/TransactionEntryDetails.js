import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GenericButton from "../Components/GenericButton";
import CustomHeader from "../Components/CustomHeader";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "UserDatabase.db" });

const TransactionEntryDetails = (props) => {
  const { navigation } = props;
  console.log("====================================");
  console.log("transactionEntryProps", props.route.params);
  console.log("====================================");
  const [transactionEntryDetails, setTransactionEntryDetails] = useState(
    props.route.params
  );
  const [customerDetails, setCustomerDetails] = useState("");
  const getAccountTransctionData = async (
    CustomerAccountId_,
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from AccountTransction where CustomerAccountId = ?",
          [CustomerAccountId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log("getAccountTransction", temp);
            onSuccess(temp);
            //setTransactionEntryDetails(temp);
          },
          (err) => {
            onFailure(err);
          }
        );
      });
    } catch (error) {
      console.log("getAccountTransctionData", error);
      onFailure(error);
    }
  };
  const getCustomerAccountData = async (
    CustomerAccountId_,
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from Customer where CustomerAccountId = ?",
          [CustomerAccountId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }

            console.log("getCustomerAccountData", temp);
            onSuccess(temp);
            setCustomerDetails(temp[0]);
            console.log("customerName", customerDetails);
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
  useEffect(() => {
    getAccountTransctionData(props.route.params.CustomerAccountId);
  }, [props.route.params?.CustomerAccountId]);
  useEffect(() => {
    if (props.route.params.CustomerAccountId) {
      getCustomerAccountData(props.route.params?.CustomerAccountId);
    }
  }, [props.route.params.CustomerAccountId]);
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={"Transaction Entry"}
        navigation={navigation}
      />
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={styles.blueBox}>
          <View style={styles.whiteBox}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      margin: 5,
                    }}
                  >
                    {customerDetails.CustomerName}
                  </Text>
                </View>

                <View>
                  <Text style={{ margin: 5 }}>100</Text>
                  <Text>You gave</Text>
                </View>
              </View>
            </View>
            <View style={styles.viewLine} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
              }}
            >
              <Text style={{ margin: 5 }}>Details</Text>
              <Text style={{ marginBottom: 10, marginLeft: 5 }}>
                {transactionEntryDetails.TransactionDescription}
              </Text>
            </View>
            <View style={styles.viewLine} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
              }}
            >
              <Text style={{ margin: 5 }}>Bill Number</Text>
              <Text style={{ marginBottom: 10, marginLeft: 5 }}>
                {transactionEntryDetails.TransactionDescription}
              </Text>
            </View>
            <View style={styles.viewLine} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
              }}
            >
              <Text style={{ margin: 5 }}>Transaction Amount</Text>
              <Text style={{ marginBottom: 10, marginLeft: 5 }}>
                {transactionEntryDetails.TransctionAmount}
              </Text>
            </View>
            <View style={styles.viewLine} />
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Text style={{ color: "blue", padding: 10 }}>EDIT </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* <View
        style={{ flexDirection: "row", width: "100%", alignSelf: "center" }}
      >
        <GenericButton
          buttonName={"YOU GAVE"}
          buttonStyle={{ width: "45%", backgroundColor: "red" }}
          onPressAction={() => {
            props.navigation.navigate("TransactionAmount");
          }}
        />
        <GenericButton
          buttonName={"YOU GOT"}
          buttonStyle={{ width: "45%", backgroundColor: "green" }}
          onPressAction={() => {
            props.navigation.navigate("TransactionAmount");
          }}
        />
      </View> */}
    </View>
  );
};

export default TransactionEntryDetails;

const styles = StyleSheet.create({
  blueBox: {
    backgroundColor: "blue",
  },
  whiteBox: {
    // height: Dimensions.get('screen').height * 0.33,
    backgroundColor: "white",
    margin: 20,
    padding: 5,
    borderRadius: 5,
  },
  letterCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 0.3,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    flexDirection: "row",
  },
  viewLine: {
    height: 0.5,
    backgroundColor: "grey",
  },
});
