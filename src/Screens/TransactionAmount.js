import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GenericTextInput from "../Components/GenericTextInput";
import GenericButton from "../Components/GenericButton";
import CustomHeader from "../Components/CustomHeader";
import { getCurrentTime, getOnlyNumbers } from "../utils";
import { useSelector } from "react-redux";
import { openDatabase } from "react-native-sqlite-storage";
import { showToast } from "../utils";

var db = openDatabase({ name: "UserDatabase.db" });

const TransactionAmount = (props) => {
  const { navigation } = props;
  const { isEdit, TransctionType, CustomerName } = props?.route?.params;
  const [accountDetails, setAccountDetails] = useState(null);
  console.log("transactionEntryProps", props.route.params);
  const [transactionDetails, settransactionDetails] = useState({
    TransctionAmount: 0,
    TransctionType: "",
    TransactionDescription: "",
    BillNo: "",
    TransactionDatatime: "",
  });
  const reduxData = useSelector((data) => data);
  useEffect(() => {
    if (isEdit) {
      const {
        TransctionAmount,
        TransactionDescription,
        BillNo,
        TransctionType,
      } = props?.route?.params;
      settransactionDetails({
        TransctionAmount: TransctionAmount,
        TransctionType: TransctionType,
        TransactionDescription: TransactionDescription,
        BillNo: BillNo,
        TransactionDatatime: "",
      });
    }
  }, [props?.route?.params]);
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
    if (props.route.params.CustomerAccountId) {
      getCustomerAccountData(props.route.params.CustomerAccountId, (data) => {
        setAccountDetails(data[0]);
      });
    }
  }, [props.route.params.CustomerAccountId]);

  const updateAccountBalance = async (
    {
      AccountBalance = "",
      UpdatedBy = "",
      CustomerAccountId = "",
      UpdatedDateTime = "",
    },

    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      console.log("====================================");
      console.log("calling");
      console.log("====================================");
      await db.transaction((tx) => {
        tx.executeSql(
          `UPDATE Customer set AccountBalance=(?), UpdatedBy=(?), UpdatedDateTime=(?) where CustomerAccountId=?`,
          [AccountBalance, UpdatedBy, UpdatedDateTime, CustomerAccountId],

          (tx, results) => {
            console.log("Results", results.rowsAffected);
            if (results.rowsAffected > 0) {
              onSuccess(results);
            } else {
              onFailure(results?.message);
            }
          },

          (err) => {
            console.log("updateCustomerAccountBalance Failed", err);
            onFailure(err);
          }
        );
      });
    } catch (error) {
      onFailure(error);
    }
  };
  async function insertIntoAccountTransction(
    onSuccess = () => {},
    onFailure = (error) => {}
  ) {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into AccountTransction " +
            "(CustomerAccountId,BusinessId,TransctionAmount,TransctionType,TransactionDescription,BillNo,TransactionDatatime) values(?,?,?,?,?,?,?)",
          [
            props.route.params.CustomerAccountId,
            reduxData.BusinessData.BusinessId,
            transactionDetails.TransctionAmount,
            props.route.params.TransctionType,
            transactionDetails.TransactionDescription,
            transactionDetails.BillNo,
            getCurrentTime(),
          ],
          (tx, results) => {
            console.log("insertIntoAccountTransction", results);
            if (results?.rowsAffected === 1) {
              // update balance
              let oldAccountBalance = accountDetails.AccountBalance || 0;
              let newAccountBal = 0;
              if (props.route.params.TransctionType === "GAVE") {
                newAccountBal =
                  parseFloat(oldAccountBalance) +
                  parseFloat(transactionDetails.TransctionAmount);
              } else {
                newAccountBal =
                  parseFloat(oldAccountBalance) -
                  parseFloat(transactionDetails.TransctionAmount);
              }
              updateAccountBalance(
                {
                  AccountBalance: newAccountBal,
                  CustomerAccountId: props.route.params.CustomerAccountId,
                  UpdatedBy: "Admin",
                  UpdatedDateTime: getCurrentTime(),
                },
                (data) => {
                  onSuccess();
                }
              );
            } else {
              onFailure(results?.message);
            }
          },
          (error) => {
            console.log("insertIntoAccountTransction Failed", error);
            onFailure(results?.message);
          }
        );
      });
    } catch (error) {
      console.log("errorereoooo", error);
      onFailure(error);
    }
  }

  async function updateAccountTransction(
    {
      transactionAmount,
      transactionDescription,
      billNo,
      accountTransctionId,
      oldAccountBalance_,
      oldTransactionAmount,
      customerAccountId,
    },
    onSuccess = () => {},
    onFailure = (error) => {}
  ) {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          `UPDATE AccountTransction set TransctionAmount=(?), TransactionDescription=(?), BillNo=(?), UpdatedBy=(?), UpdatedDateTime=(?) where AccountTransctionId=?`,
          [
            transactionAmount,
            transactionDescription,
            billNo,
            "Admin",
            getCurrentTime(),
            accountTransctionId,
          ],
          (tx, results) => {
            if (results?.rowsAffected === 1) {
              // update balance
              let oldAccountBalance = oldAccountBalance_ || 0;
              let newAccountBal = 0;
              if (props.route.params.TransctionType === "GAVE") {
                newAccountBal =
                  parseFloat(oldAccountBalance) -
                  parseFloat(oldTransactionAmount) +
                  parseFloat(transactionAmount);
              } else {
                newAccountBal =
                  parseFloat(oldAccountBalance) +
                  parseFloat(oldTransactionAmount) -
                  parseFloat(transactionAmount);
              }
              updateAccountBalance(
                {
                  AccountBalance: newAccountBal,
                  CustomerAccountId: customerAccountId,
                  UpdatedBy: "Admin",
                  UpdatedDateTime: getCurrentTime(),
                },
                (data) => {
                  onSuccess();
                }
              );
            } else {
              onFailure(results?.message);
            }
          },
          (error) => {
            console.log("UpdateIntoAccountTransction Failed", error);
            onFailure(results?.message);
          }
        );
      });
    } catch (error) {
      console.log("errorereoooo", error);
      onFailure(error);
    }
  }

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={
          TransctionType === "GAVE"
            ? `${
                isEdit
                  ? `Editing amount given to ${CustomerName}`
                  : `Giving to ${CustomerName}`
              }`
            : `${
                isEdit
                  ? `Editing amount taken from ${CustomerName}`
                  : `Taking from ${CustomerName}`
              }`
        }
        navigation={navigation}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <GenericTextInput
          placeholder={"Enter amount"}
          value={transactionDetails.TransctionAmount}
          onChangeText={(value) =>
            settransactionDetails({
              ...transactionDetails,
              TransctionAmount: getOnlyNumbers(value),
            })
          }
        />
        <GenericTextInput
          placeholder={"Enter details(Items,bill no,quantity,etc)"}
          value={transactionDetails.TransactionDescription}
          onChangeText={(value) =>
            settransactionDetails({
              ...transactionDetails,
              TransactionDescription: value,
            })
          }
        />
        <GenericTextInput
          placeholder={"Add Bill No."}
          value={transactionDetails.BillNo}
          onChangeText={(value) =>
            settransactionDetails({
              ...transactionDetails,
              BillNo: getOnlyNumbers(value),
            })
          }
        />
      </ScrollView>

      <GenericButton
        buttonName={isEdit ? "EDIT" : "SAVE"}
        onPressAction={() => {
          if (transactionDetails.TransctionAmount != "") {
            if (isEdit) {
              updateAccountTransction({
                accountTransctionId: props?.route?.params?.AccountTransctionId,
                billNo: transactionDetails.BillNo,
                customerAccountId: props?.route?.params?.CustomerAccountId,
                oldAccountBalance_: accountDetails.AccountBalance,
                oldTransactionAmount: props?.route?.params?.TransctionAmount,
                transactionAmount: transactionDetails.TransctionAmount,
                transactionDescription:
                  transactionDetails.TransactionDescription,
              },()=>{
                settransactionDetails({
                  BillNo: "",
                  TransactionDatatime: "",
                  TransactionDescription: "",
                  TransctionAmount: "",
                  TransctionType: "",
                });
                showToast({
                  mainText: "Transaction Amount Updated",
                  type: "success",
                });
                navigation.goBack();
              }
              
              );
            } else {
              insertIntoAccountTransction(() => {
                settransactionDetails({
                  BillNo: "",
                  TransactionDatatime: "",
                  TransactionDescription: "",
                  TransctionAmount: "",
                  TransctionType: "",
                });
                showToast({
                  mainText: "Transaction Amount added",
                  type: "success",
                });
                navigation.goBack();
                
              });
            }
          }
        }}
      />
    </View>
  );
};

export default TransactionAmount;

const styles = StyleSheet.create({});
