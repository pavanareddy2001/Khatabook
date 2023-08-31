import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomerTransactionDetailCard from "../Components/CustomerTransactionDetailCard";
import GenericTextInput from "../Components/GenericTextInput";
import GenericButton from "../Components/GenericButton";
import CustomHeader from "../Components/CustomHeader";
import { openDatabase } from "react-native-sqlite-storage";
import { useIsFocused } from "@react-navigation/native";
var db = openDatabase({ name: "UserDatabase.db" });

const CustomerTransactionView = (props) => {
  const isFocused = useIsFocused();
  const [transactionDetails, setTransactionDetails] = useState([]);
  const { navigation } = props;
  const [accountDetails, setAccountDetails] = useState(null);
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
            setTransactionDetails(temp);
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
  }, [props.route.params.CustomerAccountId, isFocused]);
  useEffect(() => {
    if (props.route.params.CustomerAccountId) {
      getCustomerAccountData(props.route.params.CustomerAccountId, (data) => {
        setAccountDetails(data[0]);
      });
    }
  }, [props.route.params.CustomerAccountId, isFocused]);
  function isGave(amount) {
    return parseInt(amount) < 0;
  }
  function reverse(array){
    return array?.map((item,idx) => array[array?.length-1-idx])
  }
  return (
    <View style={{ flex: 1 }}>
      
      <CustomHeader
        backArrowShow={true}
        headerTitle={`${props.route.params.CustomerName}'s Transactions`}
        navigation={navigation}
      />
      <View style={styles.topView}>
        <View style={styles.topViewBox}>
          <Text style={styles.textInViewBox}>
            {isGave(accountDetails?.AccountBalance)
              ? "You will give"
              : "You will get"}
          </Text>
          <Text
            style={[
              styles.amounttext,
              {
                color: isGave(accountDetails?.AccountBalance) ? "red" : "green",
              },
            ]}
          >
           {isGave(accountDetails?.AccountBalance)
              ? parseInt(accountDetails?.AccountBalance) * -1
              : accountDetails?.AccountBalance || 0} Rs
          </Text>
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
          <Text style={{color:"white",fontSize:16,fontWeight:"500"}} >Trans Date</Text>
          <Text style={{color:"white",fontSize:16,fontWeight:"500"}}>Trans Amount</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={reverse(transactionDetails)}
          renderItem={({ item }) => {
            return (
              <CustomerTransactionDetailCard
                DateandTime={item.TransactionDatatime}
                Balance={item.TransctionAmount}
                YouGaveAmount={item.TransctionAmount}
                YouGotAmount={item.TransctionAmount}
                BillNo={item.BillNo}
                ItemDetails={item.TransactionDescription}
                onPressCard={() => {
                  props.navigation.navigate("TransactionEntryDetails", item);
                }}
                TransctionType={item.TransctionType}
              />
            );
          }}
        />
      </View>

      <View
        style={{ flexDirection: "row", width: "100%", alignSelf: "center" }}
      >
        <GenericButton
          buttonName={"YOU GAVE"}
          buttonStyle={{ width: "45%", backgroundColor: "red" }}
          onPressAction={() => {
            props.navigation.navigate("TransactionAmount", {
              ...props.route.params,
              TransctionType: "GAVE",
            });
          }}
        />
        <GenericButton
          buttonName={"YOU GOT"}
          buttonStyle={{ width: "45%", backgroundColor: "green" }}
          onPressAction={() => {
            props.navigation.navigate("TransactionAmount", {
              ...props.route.params,
              TransctionType: "GOT",
            });
          }}
        />
      </View>
    </View>
  );
};

export default CustomerTransactionView;

const styles = StyleSheet.create({
  topView: {
    //height: Dimensions.get("screen").height * 0.10,
    backgroundColor: "blue",
  },
  text: {
    marginTop:10,
    marginLeft: 10,
    color: "white",
    fontSize: 18,
    fontWeight:"600",
  },
  topViewBox: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent:"space-between",
    alignItems:"center"
  },
  textInViewBox: {
    color: "black",
    fontSize: 14,
   fontWeight:"600",
    textTransform:"uppercase"
  },
  amounttext: {
    color: "green",
    fontSize: 16,
  },
});
