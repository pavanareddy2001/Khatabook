import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomHeader from '../Components/CustomHeader';

const Profile = (props) => {
  const {navigation}=props
  return (
    <View>
    <CustomHeader
    backArrowShow={true}
    headerTitle={"Profile"}
    navigation={navigation}

   />
    <ScrollView>
      <View>
        <View style={styles.headerView}>
          <Text>Personal info</Text>
        </View>
        <View>
        
          <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>Name</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>
         
          <View style={styles.inView}>
            <Text>Registered number</Text>
            <Text style={styles.blackText}>73376578778</Text>
          </View>
          <TouchableOpacity style={styles.inView}>
            <Text>Business name</Text>
            <Text style={styles.blackText}>Food Business</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View style={styles.headerView}>
          <Text>Business info</Text>
        </View>
        <TouchableOpacity style={styles.inView}>
          <Text>Business address</Text>
          <Text style={styles.blackText}>Bangalore 560037</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inView}>
          <Text>Business Category</Text>
          <Text style={styles.blackText}> Medical</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>Business type</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>
      </View>

      <View>
        <View style={styles.headerView}>
          <Text>Financial info</Text>
        </View>

        <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>GSTIN</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>


        <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>Bank Account</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>


        <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>Credit Score</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>


        <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>KYC Pending</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>
      </View>

      <View>
         <View style={styles.headerView}>
            <Text>Staff info</Text>
         </View>
         <TouchableOpacity style={styles.inView}>
          <View style={styles.flex}>
            <Text style={styles.blackText}>Details</Text>
            <Text style={styles.addDetailbutton}>ADD DETAILS</Text>
            </View>
          </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerView: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
  inView: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    backgroundColor:"white"
  },
  blackText: {
    color: 'black',
  },
  addDetailbutton:{
   borderRadius:25,
   borderWidth:1,
   color:"blue",
   fontSize:12,
   padding:5,
  },
  flex:{
   flexDirection:"row",
  justifyContent:"space-between"
}


});
