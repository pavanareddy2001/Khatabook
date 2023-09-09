import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import NewKhata from "../Screens/NewKhata";
import AddCustomer from "../Screens/AddCustomer";
import CustomerTransactionView from "../Screens/CustomerTransactionView";
import TransactionEntryDetails from "../Screens/TransactionEntryDetails";
import { Image, View } from "react-native";
import Profile from "../Screens/Profile";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator  
      screenOptions={{ headerShown: false }}>
        <Tab.Screen
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
          },
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../Images/home.png")}
                style={{ height: 25, width: 25, tintColor:color }}
              />
            ),
          }}
          name="Home"
          component={Home}
        />
        <Tab.Screen
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
          },
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../Images/profile.png")}
                style={{ height: 25, width: 25, tintColor:color }}
              />
            ),
          }}
          name="Profile"
          component={Profile}
        />
      </Tab.Navigator>
    </View>
  );
}

export default MyTabs;
