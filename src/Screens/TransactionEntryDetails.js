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
import { useIsFocused } from "@react-navigation/native";
import TransactionAmount from "./TransactionAmount";
var db = openDatabase({ name: "UserDatabase.db" });

function TransactionEntryCard({ title, value }) {
  return (
    <View style={styles.cardMainStyle}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}

const TransactionEntryDetails = (props) => {
  const isFocused = useIsFocused();
  const { navigation } = props;
  console.log("====================================");
  console.log("transactionEntryProps", props.route.params);
  console.log("====================================");
  const [transactionEntryDetails, setTransactionEntryDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState("");
  const getSingleAccountTransctionData = async (
    AccountTransctionId_,
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from AccountTransction where AccountTransctionId = ?",
          [AccountTransctionId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log("getSingleAccountTransction", temp);
            onSuccess(temp);
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
    getSingleAccountTransctionData(
      props.route.params.AccountTransctionId,
      (data) => {
        console.log("datadatadatadata", data);
        setTransactionEntryDetails(data[0])
      }
    );
  }, [props.route.params?.AccountTransctionId,isFocused]);
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
            <TransactionEntryCard
              title={"Customer Name"}
              value={customerDetails.CustomerName}
            />
            <TransactionEntryCard
              title={"Details"}
              value={transactionEntryDetails.TransactionDescription}
            />

            <TransactionEntryCard
              title={"Bill Number"}
              value={transactionEntryDetails.BillNo || "-"}
            />

            <TransactionEntryCard
              title={"Transaction Amount"}
              value={transactionEntryDetails.TransctionAmount}
            />

            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                props.navigation.navigate("TransactionAmount", {
                  isEdit: true,
                  ...props?.route?.params,
                });
              }}
            >
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
  cardMainStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  titleText: {
    fontSize: 12,
    color: "grey",
    fontWeight: "500",
  },
  valueText: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
  },
});
