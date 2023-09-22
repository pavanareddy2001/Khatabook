import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../Components/CustomHeader';
import {
  BUSINESS_CATEGORY,
  BUSINESS_TYPE,
  CALL,
  LOCATION_PROFILE,
  RIGHTARROW,
  USER,
} from '../Images';
import ProgressCircle from 'react-native-progress-circle';
import {useSelector} from 'react-redux';
import BussinessTypeModal from '../Components/BusinessTypeModal';

function ProfileCard({
  source,
  title,
  value,
  arrowSource,
  showRoghtArrow,
  onPressAdd,
}) {
  return (
    <View style={styles.cardView}>
      <Image style={styles.iconCard} source={source}></Image>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={value ? styles.withValue : styles.withoutValue}>
          {title}
        </Text>
        {value ? <Text style={styles.valueTxt}>{value}</Text> : null}
      </View>
      {value ? (
        showRoghtArrow ? (
          <Image style={styles.rightArrow} source={RIGHTARROW}></Image>
        ) : null
      ) : (
        <TouchableOpacity style={styles.addDetails} onPress={onPressAdd}>
          <Text style={styles.addDetailsTxt}>Add Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const Profile = props => {
  const userData = useSelector(data => data.userDataReducer.userData);
  const businessData = useSelector(data => data.BusinessData);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const {navigation} = props;
  return (
    <View style={{flex: 1}}>
      <CustomHeader
        backArrowShow={true}
        headerTitle={'Profile'}
        navigation={navigation}
      />
      <ScrollView style={{flex: 1}}>
        <View style={{alignItems: 'center', backgroundColor: 'white'}}>
          <View style={styles.headerView}>
            <Text style={styles.headerTxt}>Profile Strength</Text>
          </View>
          <ProgressCircle
            outerCircleStyle={{margin: 20}}
            percent={30}
            radius={40}
            borderWidth={10}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff">
            <Text style={{fontSize: 15}}>{'70%'}</Text>
          </ProgressCircle>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Text style={styles.profileStrengthTxt}>Profile Strength : </Text>
            <Text style={styles.profileRating}>Good</Text>
          </View>
        </View>

        <View>
          <View style={styles.headerView}>
            <Text style={styles.headerTxt}>Personal Information</Text>
          </View>
          <View>
            <ProfileCard
              source={USER}
              title={'Name'}
              value={userData?.UserName}
              showRoghtArrow={true}
            />
            <ProfileCard
              source={CALL}
              title={'Registered number'}
              value={userData?.MobileNumber}
              showRoghtArrow={true}
            />
          </View>
        </View>

        <View>
          <View style={styles.headerView}>
            <Text style={styles.headerTxt}>Business Information</Text>
          </View>
          <ProfileCard
            source={BUSINESS_CATEGORY}
            title={'Business Category'}
            value={businessData?.BusinessCategory}
            showRoghtArrow={true}
            onPressAdd={() => {
              setShowCategoryModal(true);
            }}
          />
          <ProfileCard
            source={BUSINESS_TYPE}
            title={'Business Type'}
            value={businessData?.BusinessType}
            showRoghtArrow={false}
          />
          <ProfileCard
            source={LOCATION_PROFILE}
            title={'Business Address'}
            // value={'878347373434'}
            showRoghtArrow={false}
          />
        </View>
<BussinessTypeModal
visible={showCategoryModal}
onRequestClose={()=>{setShowCategoryModal(false)}}

/>
        <View>
          <View style={styles.headerView}>
            <Text style={styles.headerTxt}>Financial Information</Text>
          </View>

          <ProfileCard
            source={LOCATION_PROFILE}
            title={'GSTIN'}
            value={businessData?.UserGSTIN}
            showRoghtArrow={false}
          />
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
    backgroundColor: '#CBE6F7',
    width: '100%',
  },
  inView: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
  },
  blackText: {
    color: 'black',
  },
  addDetailbutton: {
    borderRadius: 25,
    borderWidth: 1,
    color: 'blue',
    fontSize: 12,
    padding: 5,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightArrow: {
    height: 20,
    width: 20,
  },
  cardView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 0.2,
    borderBottomColor: 'gray',
    height: 65,
  },
  iconCard: {
    height: 25,
    width: 25,
    marginRight: 16,
  },
  withoutValue: {
    fontSize: 14,
    color: 'black',
    fontWeight: '400',
  },
  withValue: {
    fontSize: 12,
    color: 'gray',
    fontWeight: '400',
  },
  valueTxt: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
    marginTop: 4,
  },
  addDetails: {
    borderWidth: 0.5,
    padding: 7,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderColor: 'blue',
  },
  addDetailsTxt: {
    fontSize: 12,
    color: 'blue',
    fontWeight: '400',
  },
  headerTxt: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },
  profileRating: {
    fontSize: 14,
    fontWeight: '600',
    color: 'green',
  },
  profileStrengthTxt: {
    fontSize: 14,
    fontWeight: '300',
    color: 'black',
  },
});
