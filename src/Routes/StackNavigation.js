import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewKhata from '../Screens/NewKhata';
import MyTabs from './BottomTabNavigation';
import AddCustomer from '../Screens/AddCustomer';
import CustomerTransactionView from '../Screens/CustomerTransactionView';
import Home from '../Screens/Home';
import TransactionAmount from '../Screens/TransactionAmount';
import TransactionEntryDetails from '../Screens/TransactionEntryDetails';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import Splash from '../Screens/Splash';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="MyTabs" component={MyTabs}/>
          <Stack.Screen name="NewKhata" component={NewKhata} />
          <Stack.Screen name="AddCustomer" component={AddCustomer} />
          <Stack.Screen name="CustomerTransactionView" component={CustomerTransactionView}  />
          <Stack.Screen name="TransactionAmount" component={TransactionAmount}  />
           <Stack.Screen name="TransactionEntryDetails" component={TransactionEntryDetails}  /> 
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default StackNavigation


