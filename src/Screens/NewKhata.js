import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GenericTextInput from "../Components/GenericTextInput";
import GenericButton from "../Components/GenericButton";
import { openDatabase } from "react-native-sqlite-storage";
import CustomHeader from "../Components/CustomHeader";
import { showToast } from "../utils";

var db = openDatabase({ name: "UserDatabase.db" });
const NewKhata = (props) => {
  const { navigation } = props;
  const [businessName, setBusinessName] = useState("");
  console.log("====================================");
  console.log("businessName", businessName);
  console.log("====================================");

  async function insertIntoBusiness(
    onSuccess = () => {},
    onFailure = (error) => {}
  ) {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Business" + "( BusinessName) values( ?)",
          [businessName],
          (tx, results) => {
            console.log("insertIntoBusiness", results);
            if (results?.rowsAffected === 1) {
              onSuccess();
            } else {
              onFailure(results?.message);
            }
          },
          (error) => {
            console.log("insertIntoBusiness Failed", error);
            onFailure(results?.message);
          }
        );
      });
    } catch (error) {
      console.log("error"), error;
      onFailure(error);
    }
  }
  const getBusinessData = async (
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from Business",
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log("getBusiness", temp);
            onSuccess(temp);
          },
          (err) => {
            onFailure(err);
          }
        );
      });
    } catch (error) {
      console.log("getBranchData", error);
      onFailure(error);
    }
  };

  useEffect(() => {
    getBusinessData();
  }, []);

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={"Business"}
        navigation={navigation}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <GenericTextInput
          placeholder={"Enter shop/business name"}
          value={businessName}
          onChangeText={(value) => setBusinessName(value)}
        />
      </ScrollView>
      <GenericButton
        buttonName={"CREATE"}
        onPressAction={() => {
          insertIntoBusiness(() => {
            showToast({mainText:"Business created",type:"success"})
            setBusinessName("");
            getBusinessData();
            props.navigation.goBack()
          });
        }}
      />
    </View>
  );
};

export default NewKhata;

const styles = StyleSheet.create({});
