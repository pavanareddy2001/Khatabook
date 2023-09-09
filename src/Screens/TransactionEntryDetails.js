import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import GenericButton from '../Components/GenericButton';
import CustomHeader from '../Components/CustomHeader';
import {openDatabase} from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import TransactionAmount from './TransactionAmount';
import {DELETE, EDIT, SHARE} from '../Images';
import {getCurrentTime} from '../utils';
import {showToast} from '../utils';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

var db = openDatabase({name: 'UserDatabase.db'});
var RNFS = require('react-native-fs');

function TransactionEntryCard({title, value}) {
  return (
    <View style={styles.cardMainStyle}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}

const TransactionEntryDetails = props => {
  const isFocused = useIsFocused();
  const {navigation} = props;
  const screenShotRef= useRef()
  console.log('====================================');
  console.log('transactionEntryProps', props.route.params);
  console.log('====================================');
  const [transactionEntryDetails, setTransactionEntryDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState('');
  console.log('transactionEntryDetails', transactionEntryDetails);
  const getSingleAccountTransctionData = async (
    AccountTransctionId_,
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from AccountTransction where AccountTransctionId = ?',
          [AccountTransctionId_],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getSingleAccountTransction', temp);
            onSuccess(temp);
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
            setCustomerDetails(temp[0]);
            console.log('customerName', customerDetails);
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
  const captureAndShareScreenshot = () => {
    screenShotRef.current.capture().then((uri) => {
      RNFS.readFile(uri, 'base64').then((res) => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Share Title',
          message: 'Share Message',
          url: urlString,
          type: 'image/jpeg',
        };
        Share.open(options)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            err && console.log(err);
          });
      });
    });
  };
  useEffect(() => {
    getSingleAccountTransctionData(
      props.route.params.AccountTransctionId,
      data => {
        console.log('datadatadatadata', data);
        setTransactionEntryDetails(data[0]);
      },
    );
  }, [props.route.params?.AccountTransctionId, isFocused]);
  useEffect(() => {
    if (props.route.params.CustomerAccountId) {
      getCustomerAccountData(props.route.params?.CustomerAccountId);
    }
  }, [props.route.params.CustomerAccountId]);

  const updateAccountBalance = async (
    {
      AccountBalance = '',
      UpdatedBy = '',
      CustomerAccountId = '',
      UpdatedDateTime = '',
    },

    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(tx => {
        tx.executeSql(
          `UPDATE Customer set AccountBalance=(?), UpdatedBy=(?), UpdatedDateTime=(?) where CustomerAccountId=?`,
          [AccountBalance, UpdatedBy, UpdatedDateTime, CustomerAccountId],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              onSuccess(results);
            } else {
              onFailure(results?.message);
            }
          },
          err => {
            console.log('updateCustomerAccountBalance Failed', err);
            onFailure(err);
          },
        );
      });
    } catch (error) {
      onFailure(error);
    }
  };
  async function deleteTransaction(
    {
      accountTransctionId,
      oldAccountBalance_,
      transactionAmt,
      customerAccountId,
    },
    onSuccess = data => {},
    onFailure = error => {},
  ) {
    try {
      await db.transaction(async tx => {
        await tx.executeSql(
          `DELETE FROM AccountTransction where AccountTransctionId=?`,
          [accountTransctionId],
          (tx, results) => {
            if (results?.rowsAffected === 1) {
              // update balance
              let oldAccountBalance = oldAccountBalance_ || 0;
              let newAccountBal = 0;
              if (props.route.params.TransctionType === 'GAVE') {
                newAccountBal =
                  parseFloat(oldAccountBalance) - parseFloat(transactionAmt);
              } else {
                newAccountBal =
                  parseFloat(oldAccountBalance) + parseFloat(transactionAmt);
              }
              updateAccountBalance(
                {
                  AccountBalance: newAccountBal,
                  CustomerAccountId: customerAccountId,
                  UpdatedBy: 'Admin',
                  UpdatedDateTime: getCurrentTime(),
                },
                data => {
                  onSuccess();
                },
              );
            } else {
              console.log('UpdateIntoAccountTransction Failed', results);
              onFailure(results?.message);
            }
          },
          error => {
            console.log('UpdateIntoAccountTransction Failed', error);
            onFailure(results?.message);
          },
        );
      });
    } catch (error) {
      console.log('errorereoooo', error);
      onFailure(error);
    }
  }
  function onPressDelete(params, onSuccess) {
    Alert.alert('Delete Transaction', 'Are you sure want to delete', [
      {text: 'Cancel'},
      {
        text: 'Confirm',
        onPress: () => {
          deleteTransaction(params, () => {
            onSuccess();
          });
        },
      },
    ]);
  }
  return (
    <View style={{flex: 1}}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={'Transaction Details'}
        navigation={navigation}
      />
      <ScrollView style={{flex: 1, width: '100%'}} scrollEnabled={false}>
        <View style={styles.blueBox}>
          <View style={styles.whiteBox}>
            <ViewShot
            ref={screenShotRef}
            // ref={ref => {
            //   screenShotRef.current = ref;
            // }}
            options={{format: 'jpg', quality: 0.9}}
            >
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  <View style={styles.circleView}>
                    <Text style={styles.textLetter}>
                      {customerDetails?.CustomerName
                        ? customerDetails?.CustomerName[0]
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={{marginLeft: 25, justifyContent: 'space-between'}}>
                    <Text style={styles.customerName}>
                      {customerDetails.CustomerName}
                    </Text>
                    <Text style={styles.transDate}>
                      {transactionEntryDetails.TransactionDatatime}
                    </Text>
                  </View>
                </View>
              </View>
              <TransactionEntryCard
                title={'Details'}
                value={transactionEntryDetails.TransactionDescription || '-'}
              />

              <TransactionEntryCard
                title={'Bill Number'}
                value={transactionEntryDetails.BillNo || '-'}
              />

              <TransactionEntryCard
                title={'Transaction Amount'}
                value={'₹ ' + transactionEntryDetails.TransctionAmount}
              />
              <TransactionEntryCard
                title={'Running Balance'}
                value={'₹ ' + customerDetails.AccountBalance}
              />
            </ViewShot>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 12,
              }}
              onPress={() => {
                props.navigation.navigate('TransactionAmount', {
                  isEdit: true,
                  ...props?.route?.params,
                });
              }}>
              <Image
                style={{height: 16, width: 16, tintColor: 'blue'}}
                source={EDIT}
              />
              <Text
                style={{
                  color: 'blue',
                  padding: 10,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                EDIT ENTRY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{flexDirection: 'row', width: '100%', alignSelf: 'center'}}>
        <GenericButton
          buttonName={'SHARE'}
          icon={SHARE}
          iconStyle={{tintColor: 'white', marginRight: 10}}
          buttonStyle={{width: '45%', backgroundColor: 'blue'}}
          onPressAction={async () => {captureAndShareScreenshot()}}
        />
        <GenericButton
          buttonName={'DELETE'}
          textStyle={{color: 'red'}}
          icon={DELETE}
          iconStyle={{tintColor: 'red', marginRight: 10}}
          buttonStyle={{
            width: '45%',
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: 'red',
          }}
          onPressAction={() => {
            onPressDelete(
              {
                accountTransctionId:
                  transactionEntryDetails?.AccountTransctionId,
                oldAccountBalance_: customerDetails?.AccountBalance,
                transactionAmt: transactionEntryDetails?.TransctionAmount,
                customerAccountId: customerDetails?.CustomerAccountId,
              },
              () => {
                showToast({mainText: 'Transaction Deleted Successfully...!'});
                props.navigation.goBack();
              },
            );
          }}
        />
      </View>
    </View>
  );
};

export default TransactionEntryDetails;

const styles = StyleSheet.create({
  blueBox: {
    backgroundColor: 'blue',
  },
  whiteBox: {
    backgroundColor: 'white',
    margin: 20,
    padding: 12,
    borderRadius: 5,
  },
  letterCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 0.3,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    flexDirection: 'row',
  },
  viewLine: {
    height: 0.5,
    backgroundColor: 'grey',
  },
  cardMainStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
  },
  titleText: {
    fontSize: 12,
    color: 'grey',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
  circleView: {
    height: 40,
    width: 40,
    marginLeft: 6,
    borderRadius: 20,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLetter: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  customerName: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  transDate: {
    fontSize: 12,
    color: 'gray',
    fontWeight: '400',
    marginTop: 4,
  },
});
