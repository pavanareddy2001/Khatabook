import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import GenericTextInput from '../Components/GenericTextInput';
import CustomHeader from '../Components/CustomHeader';
import {openDatabase} from 'react-native-sqlite-storage';
import GenericButton from '../Components/GenericButton';
import { useSelector } from 'react-redux';

var db = openDatabase({name: 'UserDatabase.db'});
const AddCustomer = props => {
  const {navigation} = props;
  const [customerDetails, setCustomerDetails] = useState({
    CustomerName: '',
    CustomerMobileNumber: '',
    CustomerGSTIN: '',
    FlatBuiding: '',
    AddressArea: '',
    Pincode: '',
    City: '',
    State: '',
  });
const [showGstView, setShowGstView] = useState(false)
const reduxData=useSelector(data=>data)
console.log('====================================');
console.log('reduxData',reduxData);
console.log('====================================');

  async function insertIntoCustomer(
    onSuccess = () => {},
    onFailure = error => {},
  ) {
    try {
      await db.transaction(async tx => {
        await tx.executeSql(
          'insert into Customer ' +
            '(BusinessId,CustomerName,CustomerMobileNumber,CustomerGSTIN,FlatBuiding,AddressArea,Pincode,City,State) values(?,?,?,?,?,?,?,?,?)',
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
            console.log('insertIntoCustomer', results);
            if (results?.rowsAffected === 1) {
              onSuccess();
            } else {
              onFailure(results?.message);
            }
          },
          error => {
            console.log('insertIntoCustomer Failed', error);
            onFailure(results?.message);
          },
        );
      });
    } catch (error) {
      console.log('error'), error;
      onFailure(error);
    }
  }

  const getCustomerData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from Customer',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getCustomer', temp);
            onSuccess(temp);
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getCustomerData', error);
      onFailure(error);
    }
  };
  return (
    <View style={{flex:1}}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={'AddCustomer'}
        navigation={navigation}
      />
      <ScrollView style={{flex:1}}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <GenericTextInput
            placeholder={'Party name'}
            value={customerDetails.CustomerName}
            onChangeText={value =>
              setCustomerDetails({
                ...customerDetails,
                CustomerName: value,
              })
            }
          />
          <GenericTextInput
            placeholder={'Mobile Number'}
            value={customerDetails.CustomerMobileNumber}
            onChangeText={value =>
              setCustomerDetails({
                ...customerDetails,
                CustomerMobileNumber: value,
              })
            }
          />
          <TouchableOpacity
          onPress={()=>{setShowGstView(!showGstView)}}
          ><Text style={{color:"blue"}}>+ADD GSTIN & ADDRESS(OPTIONAL)</Text></TouchableOpacity>
          {showGstView?<View style={{width: '100%', alignItems: 'center'}}>
            <GenericTextInput
              placeholder={'GSTIN'}
              value={customerDetails.CustomerGSTIN}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  CustomerGSTIN: value,
                })
              }
            />

            <GenericTextInput
              placeholder={'Flat / Building Number'}
              value={customerDetails.FlatBuiding}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  FlatBuiding: value,
                })
              }
            />
            <GenericTextInput
              placeholder={'Area / Locality'}
              value={customerDetails.AddressArea}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  AddressArea: value,
                })
              }
            />
            <GenericTextInput
              placeholder={'Pincode'}
              value={customerDetails.Pincode}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  Pincode: value,
                })
              }
            />
            <GenericTextInput
              placeholder={'City'}
              value={customerDetails.City}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  City: value,
                })
              }
            />
            <GenericTextInput
              placeholder={'State'}
              value={customerDetails.State}
              onChangeText={value =>
                setCustomerDetails({
                  ...customerDetails,
                  State: value,
                })
              }
            />
          </View>:null}
          

        </View>
      </ScrollView>

      <GenericButton
           buttonStyle={{ alignSelf: 'center'}}
            buttonName={'ADD'}
            onPressAction={() => {
              insertIntoCustomer(() => {
                Alert.alert('Customer added');
                getCustomerData();
                setCustomerDetails({
                  CustomerName: '',
                  CustomerMobileNumber: '',
                  CustomerGSTIN: '',
                  FlatBuiding: '',
                  AddressArea: '',
                  Pincode: '',
                  City: '',
                  State: '',
                })
              navigation.navigate("Home")
              });
            }}
          />
    </View>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({});
