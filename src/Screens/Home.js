import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import GenericTextInput from "../Components/GenericTextInput";
import BussinessListModal from "../Components/BussinessListModal";
import CustomHeader from "../Components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabase } from "react-native-sqlite-storage";
import { useDispatch } from "react-redux";
import { showToast } from "../utils";

var db = openDatabase({ name: "UserDatabase.db" });

const Home = (props) => {
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState([]);
  const [masterCusData, setMasterCusData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedBussiness, setSelectedBussiness] = useState(null);
  const [searchTxt, setSearchTxt] = useState("");
  const getCustomerData = async (
    BusinessId,
    onSuccess = (data) => {},
    onFailure = (error) => {}
  ) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "select * from Customer WHERE BusinessId=(?)",
          [BusinessId],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log("getCustomer", temp);
            onSuccess(temp);
            setCustomerData(temp);
            setMasterCusData(temp);
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

  async function getBusinessData() {
    const value = await AsyncStorage.getItem("selectedBussiness");
    if (value !== null) {
      console.log("getBusinessData", value);
      setSelectedBussiness(JSON.parse(value));
      dispatch({ type: "UPDATE_BUSINESSDATA", payload: JSON.parse(value) });
      getCustomerData(JSON.parse(value).BusinessId);
    }
  }
  function isGave(amount) {
    return parseInt(amount) < 0;
  }
  function totalAmount(cusData) {
    let giveAmount = 0;
    let getAmount = 0;
    cusData?.map((item) => {
      if (isGave(item?.AccountBalance)) {
        giveAmount = giveAmount + parseFloat(item?.AccountBalance || 0);
      } else {
        getAmount = getAmount + parseFloat(item?.AccountBalance || 0);
      }
    });
    return { giveAmount: giveAmount * -1, getAmount };
  }
  useEffect(() => {
    getBusinessData();
  }, [visible]);

  useEffect(() => {
    let willFocus;
    willFocus = props.navigation.addListener("focus", async (payload) => {
      getCustomerData(selectedBussiness?.BusinessId);
      console.log("====================================");
      console.log("callec");
      console.log("====================================");
    });
    return willFocus;
  }, [selectedBussiness]);

  useEffect(() => {
    if (searchTxt !== "") {
      const filteredData = masterCusData?.filter((item) => {
        return item?.CustomerName?.toLowerCase()?.includes(
          searchTxt?.toLowerCase()
        );
      });
      setCustomerData(filteredData);
    } else {
      setCustomerData(masterCusData);
    }
  }, [searchTxt]);

  return (
    <View style={{ flex: 1 }}>
      {visible ? (
        <BussinessListModal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          selectedBusinessId={selectedBussiness?.BusinessId}
          onpresscreatekb={() => {
            setVisible(false);
            props.navigation.navigate("NewKhata");
          }}
        />
      ) : null}
      <View style={styles.subView}>
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row", paddingTop: 12 }}
            onPress={() => {
              setVisible(true);
            }}
          >
            <Image
              style={{ width: 30, height: 30, tintColor: "white" }}
              source={require("../Images/bookA.png")}
            />
            <Text style={styles.text}>
              {selectedBussiness?.BusinessName || "Choose a Business"}{" "}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.viewBox}>
          <View>
            <Text style={styles.YouwillText}>You will give</Text>
            <Text style={styles.redText}>
              {totalAmount(customerData).giveAmount}
            </Text>
          </View>
          <View style={styles.inboxView}>
            <Text style={styles.YouwillText}>You will get</Text>
            <Text style={styles.greentext}>
              {totalAmount(customerData).getAmount}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[styles.subView2, { width: Dimensions.get("screen").width }]}
      >
        <GenericTextInput
          placeholder={"Search Customer"}
          value={searchTxt}
          onChangeText={setSearchTxt}
        />
        <TouchableOpacity>
          <Image
            style={styles.filterImage}
            source={require("../Images/filter.png")}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={customerData}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("CustomerTransactionView", item);
              }}
            >
              <View style={styles.customerListView}>
                <View style={styles.customerNameView}>
                  <View style={styles.letterCircle}>
                    <Text style={styles.alphabetText}>
                      {item.CustomerName[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.bussinessNameText}>
                      {item?.CustomerName}
                    </Text>
                    <Text style={styles.timeStamp}>7 days ago</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.greentext,
                    { color: isGave(item?.AccountBalance) ? "red" : "green" },
                  ]}
                >
                  {" "}
                  {isGave(item?.AccountBalance)
                    ? parseInt(item?.AccountBalance) * -1
                    : item?.AccountBalance || 0}{" "}
                  Rs
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.addCustomerButton}
        onPress={() => {
          if (selectedBussiness?.BusinessName) {
            props.navigation.navigate("AddCustomer");
          } else {
            showToast({
              mainText: "Choose a Business to add customer",
              type: "error",
            });
          }
        }}
      >
        <Image
          source={require("../Images/addCustomer.png")}
          style={{ width: 35, height: 35 }}
        />
        <Text style={styles.addCustomerText}>ADD CUSTOMER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  subView: {
    width: "100%",
    backgroundColor: "blue",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
    marginLeft: 8,
  },
  viewBox: {
    backgroundColor: "white",
    padding: 12,
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
  },
  YouwillText: {
    color: "black",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  greentext: {
    color: "green",
    fontSize: 14,
    fontWeight: "400",
  },
  redText: {
    color: "red",
    fontSize: 14,
    fontWeight: "400",
  },
  subView2: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 0.5,
    borderBottomColor: "grey",
  },
  filterImage: {
    width: 40,
    height: 40,
    margin: 10,
  },
  customerListView: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    padding: 10,
  },
  letterCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 12,
    backgroundColor: "#CBE6F7",
    justifyContent: "center",
    alignItems: "center",
  },
  alphabetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "blue",
  },
  customerNameView: {
    flexDirection: "row",
  },
  bussinessNameText: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
  timeStamp: {
    fontSize: 12,
    fontWeight: "300",
    color: "grey",
  },
  addCustomerButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    paddingVertical: 5,
    bottom: 20,
    right: 20,
    width: "50%",
    borderRadius: 25,
    backgroundColor: "#CBE6F7",
  },
  addCustomerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "blue",
  },
  topBlankView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
