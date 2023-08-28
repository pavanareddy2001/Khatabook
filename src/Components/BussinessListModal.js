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
import { CROSS } from '../Images';




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
            minHeight: '20%',
            maxHeight: '50%',
            backgroundColor: 'white',
            borderTopEndRadius: 12,
            borderTopLeftRadius: 12,
          }}>
         <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', margin: 16}}>
            <Text style={styles.heading}>Business List</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Image style={{height: 40, width: 40, tintColor: 'black'}}  source={CROSS} />
            </TouchableOpacity>
         </View>
          {bussinessNameData?.length === 0 && 
            <Text style={styles.notFound}>No Business Added</Text>
          }
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
                      <Text style={styles.noOfCus}>{item?.customerNo || '0 customers'}</Text>
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
    padding: 12,
    borderRadius: 5,
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  bussinessNameText: {
    fontSize: 15,
    color: 'black',
    marginBottom: 6,
    fontWeight: '600'
  },
  createKBB: {
    width: '90%',
    margin: 10,
    padding: 10,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'blue',
    marginBottom: 20,
    borderRadius: 8
  },
  createKBBText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
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
  noOfCus: {
    fontSize: 12,
    color: "gray",
    fontWeight: '500'
  },
  notFound: {
    fontSize: 15,
    color: "black",
    width: '100%',
    textAlign: 'center',
    marginVertical: 16
  },
  heading: {
    fontSize: 18,
    color: "black",
    fontWeight: '700'
  }
});
