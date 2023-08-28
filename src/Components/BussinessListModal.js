import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';




var db = openDatabase({name: 'UserDatabase.db'});

const BussinessListModal = (props) => {
  const {visible, onRequestClose,selectedBusinessId, onpresscreatekb} =props
  const [bussinessNameData, setBussinessNameData] = useState([]);

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
            console.log('getBusinessData', temp);
            onSuccess(temp);
            setBussinessNameData(temp);
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
  useEffect(() => {
    // let willFocus;
    // willFocus = props.navigation.addListener('focus', async payload => {
    getBusinessData();
    // });
    // return willFocus;
  }, []);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          flex: 1,
          //flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          // alignSelf: 'center'
        }}>
        <TouchableOpacity
          style={styles.topBlankView}
          onPress={onRequestClose}
        />
        <View
          style={{
            width: '100%',
            maxHeight: '50%',
            backgroundColor: 'white',
          }}>
          <FlatList
            data={bussinessNameData}
            renderItem={({item}) => {
              return (
                <ScrollView>
                  <TouchableOpacity 
                  onPress={async ()=>{
                    await AsyncStorage.setItem('selectedBussiness', JSON.stringify(item));
                    onRequestClose()
                  }}
                  >
                    <View style={styles.bussinessNameView}>
                      <View style={styles.nameView}>
                        <Text style={styles.bussinessNameText}>
                          {item?.BusinessName}
                        </Text>
                        {selectedBusinessId==item.BusinessId?<Image
                          style={styles.selectedImg}
                          source={require('../Images/selected.png')}
                        />:null}
                        
                      </View>
                      <Text>{item?.customerNo || '0 customer'}</Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              );
            }}
          />
          <TouchableOpacity
            style={styles.createKBB}
            onPress={() => {
              onpresscreatekb();
            }}>
            <Text style={styles.createKBBText}>+ CREATE NEW KHATHABOOK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BussinessListModal;

const styles = StyleSheet.create({
  bussinessNameView: {
    borderWidth: 0.5,
    margin: 10,
    padding: 20,
    borderRadius: 5,
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  bussinessNameText: {
    fontSize: 18,
    color: 'black',
  },
  createKBB: {
    width: '80%',
    margin: 10,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'blue',
  },
  createKBBText: {
    color: 'white',
  },
  topBlankView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  selectedImg: {
    width: 20,
    height: 20,
  },
});
