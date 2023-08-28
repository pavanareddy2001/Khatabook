import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericTextInput from '../Components/GenericTextInput';
import BussinessListModal from '../Components/BussinessListModal';
import CustomHeader from '../Components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import {useDispatch} from 'react-redux';

var db = openDatabase({name: 'UserDatabase.db'});

const Home = props => {
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedBussiness, setSelectedBussiness] = useState(null);
  const getCustomerData = async (
    BusinessId,
    onSuccess = data => {},
    onFailure = error => {},
  ) => {
    try {
      await db.transaction(async tx => {
        tx.executeSql(
          'select * from Customer WHERE BusinessId=(?)',
          [BusinessId],
          (txn, results) => {
            var len = results?.rows?.length;
            let temp = [];
            for (let i = 0; i < len; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('getCustomer', temp);
            onSuccess(temp);
            setCustomerData(temp);
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

  async function getBusinessData() {
    const value = await AsyncStorage.getItem('selectedBussiness');
    if (value !== null) {
      console.log('getBusinessData', value);
      setSelectedBussiness(JSON.parse(value));
      dispatch({type: 'UPDATE_BUSINESSDATA', payload: JSON.parse(value)});
      getCustomerData(JSON.parse(value).BusinessId)
    }
  }
  useEffect(() => {
    getBusinessData();
  }, [visible]);

  useEffect(() => {
    let willFocus;
    willFocus = props.navigation.addListener('focus', async payload => {
      getCustomerData(selectedBussiness?.BusinessId);
      console.log('====================================');
      console.log("callec");
      console.log('====================================');
    });
    return willFocus;
  }, [selectedBussiness]);

  return (
    <View style={{flex: 1}}>
      {visible ? (
        <BussinessListModal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          selectedBusinessId={selectedBussiness?.BusinessId}
          onpresscreatekb={() => {
            setVisible(false)
            props.navigation.navigate('NewKhata');
          }}
        />
      ) : null}
      <View style={styles.subView}>
        <View>
          <TouchableOpacity
            style={{flexDirection: 'row', paddingTop: 12}}
            onPress={() => {
              setVisible(true);
            }}>
            <Image
              style={{width: 30, height: 30, tintColor: 'white'}}
              source={require('../Images/bookA.png')}
            />
            <Text style={styles.text}>
              {selectedBussiness?.BusinessName || 'Choose a Business'}{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.viewBox}>
          <View style={styles.inboxView}>
            <Text style={styles.greentext}> 70 </Text>
            <Text>You will give</Text>
          </View>
          <View style={styles.inboxView}>
            <Text style={styles.redText}> 10 </Text>
            <Text>You will get</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.redText, {color: 'blue'}]}>View Report</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.subView2, {width: Dimensions.get('screen').width}]}>
        <GenericTextInput placeholder={'Search Customer'} />
        <TouchableOpacity>
          <Image
            style={styles.filterImage}
            source={require('../Images/filter.png')}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={customerData}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('CustomerTransactionView',item);
              }}>
              <View style={styles.customerListView}>
                <View style={styles.customerNameView}>
                  <View style={styles.letterCircle}>
                    <Text style={styles.alphabetText}>{item.CustomerName[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.bussinessNameText}>
                      {' '}
                      {item?.CustomerName}
                    </Text>
                    <Text> {item.login}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.greentext}> {item.amount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* <View style={styles.addCustomerView}> */}
      <TouchableOpacity
        style={styles.addCustomerButton}
        onPress={() => {
          props.navigation.navigate('AddCustomer');
        }}>
        <Image
          source={require('../Images/addCustomer.png')}
          style={{width: 35, height: 35}}
        />
        <Text style={styles.addCustomerText}>ADD CUSTOMER</Text>
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  subView: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.2,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 8,
  },
  viewBox: {
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    flexDirection: 'row',
    borderRadius: 5,
  },
  inboxView: {
    marginRight: '15%',
  },
  greentext: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
  },
  redText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  subView2: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderBottomColor: 'grey',
    // backgroundColor: 'red'
  },
  filterImage: {
    width: 40,
    height: 40,
    margin: 10,
    // backgroundColor: 'red'
  },
  customerListView: {
    flexDirection: 'row',
    // marginTop:10,
    // marginLeft:10,
    borderWidth: 0.5,
    borderBottomColor: 'grey',
    padding: 10,
  },
  letterCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 0.3,
  },
  alphabetText: {
    marginLeft: 12,
    marginTop: 5,
  },
  customerNameView: {
    flexDirection: 'row',
    marginRight: '50%',
  },
  addCustomerView: {
    flexDirection: 'row-reverse',
    marginTop: '70%',
  },
  addCustomerButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderWidth: 1,
    width: '50%',
    borderRadius: 25,
    backgroundColor: 'brown',
  },
  addCustomerText: {
    padding: 10,
    color: 'white',
  },
  topBlankView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
