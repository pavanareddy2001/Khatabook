import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {  RIGHTARROW } from "../Images";

const CustomerTransactionDetailCard = ({
  DateandTime,
  Balance,
  YouGaveAmount,
  YouGotAmount,
  BillNo,
  ItemDetails,
  onPressCard,
  TransctionType,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardMainView}
      onPress={() => {
        onPressCard();
      }}
    >
      <View>
        <Text style={{ fontSize: 14, color: "black", fontWeight: "400" }}>
          {DateandTime}
        </Text>
      </View>
      <View style={[{ flexDirection: "row" }]}>
        <Text style={styles.youGaveAmount}>
          {TransctionType === "GAVE" && YouGaveAmount}
        </Text>
        <Text style={styles.youGotAmount}>
          {TransctionType === "GOT" && YouGotAmount}
        </Text>
        <Image source={RIGHTARROW} style={{width:15,height:15,marginLeft:8}}></Image>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerTransactionDetailCard;

const styles = StyleSheet.create({
  cardMainView: {
    borderWidth: 0.3,
    margin: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
  },
  marginStyle: {},
  youGaveAmount: {
    color: "red",
    width: 100,
  },
  youGotAmount: {
    color: "green",
  },
});
