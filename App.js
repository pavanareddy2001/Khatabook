import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Splash from './src/Screens/Splash';
import {NavigationContainer} from '@react-navigation/native';
import MyTabs from './src/Routes/BottomTabNavigation';
import StackNavigation from './src/Routes/StackNavigation';
import Toast from 'react-native-toast-message';
import store from './src/Redux/store';
import { Provider } from 'react-redux';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});
const App = () => {
  const [loading, setLoading] = useState(true);
  function createBusinessTable() {
    console.log('creating table Business');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Business'",
        [],
        function (tx, res) {
          console.log('item:', res);
          if (res?.rows?.length == 0) {
            txn.executeSql(
              'create table if not exists Business' +
                '(BusinessId integer primary key AUTOINCREMENT,' +
                'BusinessName text ' +
                'BusinessDescription text, ' +
                'BusinessCategory text, ' +
                'BusinessType text, ' +
                'UserGSTIN text, ' +
                'FlatBuiding text, ' +
                'AddressArea text, ' +
                'Pincode text, ' +
                'City text, ' +
                'State text, ' +
                'AddedBy text, ' +
                'AddedDateTime text, ' +
                'UpdatedBy text, ' +
                'UpdatedDateTime text' +
                '  );',
              [],
              (tx, results) => {
                console.log('Results', results);
              },
              err => {
                console.log('Error', err);
              },
            );
          }
        },
      );
      console.log('table created Business');
    });
  }

  const getBusinessData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from Business',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getBusiness', temp);
            onSuccess(temp);
            // dispatch(updateBranchData(temp?.length ? temp[0] : {}));
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getBranchData', error);
      onFailure(error);
    }
  };

  function createCustomerTable() {
    console.log('creating table Customer');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'",
        [],
        function (tx, res) {
          console.log('item:', res);
          if (res?.rows?.length == 0) {
            txn.executeSql(
              'create table if not exists Customer' +
                '(CustomerAccountId integer primary key AUTOINCREMENT,' +
                'BusinessId integer, ' +
                'CustomerName text, ' +
                'CustomerMobileNumber text, ' +
                'CustomerGSTIN text, ' +
                'FlatBuiding text, ' +
                'AddressArea text, ' +
                'Pincode text, ' +
                'City text, ' +
                'State text, ' +
                'AccountBalance text, ' +
                'PreviousBalance text, ' +
                'AddedBy text, ' +
                'AddedDateTime text, ' +
                'UpdatedBy text, ' +
                'UpdatedDateTime text' +
                '  );',
              [],
              (tx, results) => {
                console.log('Results', results);
              },
              err => {
                console.log('Error', err);
              },
            );
          }
        },
      );
      console.log('table created Customer');
    });
  }

  const getCustomerData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from Business',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getBusiness', temp);
            onSuccess(temp);
            // dispatch(updateBranchData(temp?.length ? temp[0] : {}));
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getBranchData', error);
      onFailure(error);
    }
  };
  function createAccountTransctionTable() {
    console.log('creating table AccountTransction');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='AccountTransction'",
        [],
        function (tx, res) {
          console.log('item:', res);
          if (res?.rows?.length == 0) {
            txn.executeSql(
              'create table if not exists AccountTransction' +
                '(AccountTransctionId integer primary key AUTOINCREMENT,' +
                'CustomerAccountId integer, ' +
                'BusinessId integer, ' +
                'TransctionAmount text, ' +
                'TransctionType text, ' +
                'TransactionDescription text, ' +
                'BillNo text, ' +
                'TransactionDatatime text, ' +
                'AddedBy text, ' +
                'AddedDateTime text, ' +
                'UpdatedBy text, ' +
                'UpdatedDateTime text' +
                '  );',
              [],
              (tx, results) => {
                console.log('Results', results);
              },
              err => {
                console.log('Error', err);
              },
            );
          }
        },
      );
      console.log('table created AccountTransction');
    });
  }
  const getAccountTransactionData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from AccountTransction',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getAccountTransction', temp);
            onSuccess(temp);
            // dispatch(updateBranchData(temp?.length ? temp[0] : {}));
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
  function createUserDetailsTable() {
    console.log('creating table User');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='UserDetails'",
        [],
        function (tx, res) {
          console.log('item:', res);
          if (res?.rows?.length == 0) {
            txn.executeSql(
              'create table if not exists UserDetails' +
                '(UserId integer primary key AUTOINCREMENT,' +
                'UserName text, ' +
                'UserLoginId integer, ' +
                'UserPassword text, ' +
                'MobileNumber text, ' +
                'AddedBy text, ' +
                'AddedDateTime text, ' +
                'UpdatedBy text, ' +
                'UpdatedDateTime text' +
                '  );',
              [],
              (tx, results) => {
                console.log('Results', results);
              },
              err => {
                console.log('Error', err);
              },
            );
          }
        },
      );
      console.log('table created UserDetails');
    });
  }
  const getUserData = async (
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from UserDetails',
          [],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getUserDetails', temp);
            onSuccess(temp);
            // dispatch(updateBranchData(temp?.length ? temp[0] : {}));
          },
          err => {
            onFailure(err);
          },
        );
      });
    } catch (error) {
      console.log('getUserDetailsData', error);
      onFailure(error);
    }
  };
  useEffect(() => {
    createBusinessTable();
    createCustomerTable();
    createAccountTransctionTable();
    createUserDetailsTable();
    getBusinessData();
    getCustomerData();
    getAccountTransactionData();
    getUserData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  if (loading) {
    return (
      <View>
        <Splash />
      </View>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <Provider store={store}>
        <StackNavigation />
        <Toast
        position='bottom'
        />
      </Provider>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
