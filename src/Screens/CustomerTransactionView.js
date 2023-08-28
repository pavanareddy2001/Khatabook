import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomerTransactionDetailCard from '../Components/CustomerTransactionDetailCard';
import GenericTextInput from '../Components/GenericTextInput';
import GenericButton from '../Components/GenericButton';
import CustomHeader from '../Components/CustomHeader';
import {openDatabase} from 'react-native-sqlite-storage';
import { useIsFocused } from "@react-navigation/native";
var db = openDatabase({name: 'UserDatabase.db'});

const CustomerTransactionView = props => {
  const isFocused = useIsFocused();
  const [transactionDetails, setTransactionDetails] = useState('');
  const {navigation} = props;
  const [accountDetails  , setAccountDetails  ] = useState(null)
  const getAccountTransctionData = async (
    CustomerAccountId_,
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from AccountTransction where CustomerAccountId = ?',
          [CustomerAccountId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getAccountTransction', temp);
            onSuccess(temp);
            setTransactionDetails(temp);
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getAccountTransctionData', error);
      onFailure(error);
    }
  };


  const getCustomerAccountData = async (
    CustomerAccountId_,
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from Customer where CustomerAccountId = ?',
          [CustomerAccountId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }

            console.log('getCustomerAccountData', temp);
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

  useEffect(() => {
    getAccountTransctionData(props.route.params.CustomerAccountId);
  }, [props.route.params.CustomerAccountId, isFocused]);
  useEffect(() => {
    if (props.route.params.CustomerAccountId) {
      getCustomerAccountData(props.route.params.CustomerAccountId, data => {
        setAccountDetails(data[0]);
      });
    }
  }, [props.route.params.CustomerAccountId, isFocused]);
  return (
    <View style={{flex: 1}}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={'CustomerTransactionView'}
        navigation={navigation}
      />
      <View style={styles.topView}>
        <Text style={styles.text}>{props.route.params.CustomerName}</Text>
        <View style={styles.topViewBox}>
          <Text style={styles.textInViewBox}>You will give</Text>
          <Text style={styles.amounttext}>{accountDetails?.AccountBalance}</Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={transactionDetails}
          renderItem={({item}) => {
            return (
              <CustomerTransactionDetailCard
                DateandTime={item.TransactionDatatime}
                Balance={item.TransctionAmount}
                YouGaveAmount={item.TransctionAmount}
                YouGotAmount={item.TransctionAmount}
                BillNo={item.BillNo}
                ItemDetails={item.TransactionDescription}
                onPressCard={() => {
                  props.navigation.navigate('TransactionEntryDetails',item);
                }}
                TransctionType={item.TransctionType}
              />
            );
          }}
        />
      </View>

      <View style={{flexDirection: 'row', width: '100%', alignSelf: 'center'}}>
        <GenericButton
          buttonName={'YOU GAVE'}
          buttonStyle={{width: '45%', backgroundColor: 'red'}}
          onPressAction={() => {
            props.navigation.navigate('TransactionAmount', {
              ...props.route.params,
              TransctionType: 'GAVE',
            });
          }}
        />
        <GenericButton
          buttonName={'YOU GOT'}
          buttonStyle={{width: '45%', backgroundColor: 'green'}}
          onPressAction={() => {
            props.navigation.navigate('TransactionAmount', {
              ...props.route.params,
              TransctionType: 'GOT',
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
    height: Dimensions.get('screen').height * 0.15,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  topViewBox: {
    borderWidth: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingLeft: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  textInViewBox: {
    color: 'black',
    fontSize: 16,
    paddingRight: '60%',
  },
  amounttext: {
    color: 'green',
    fontSize: 16,
  },
});
