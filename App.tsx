import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import store from "./src/store";
import AuthContextProvider, { useAuth } from "./src/context/AuthContext";
import theme from "./src/theme";
import SplashScreen from "./src/screens/SplashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SurveyScreen from "./src/screens/SurveyScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CardsListScreen from "./src/screens/CardsListScreen";
import CardDetailsScreen from "./src/screens/CardDetailsScreen";
import CompareScreen from "./src/screens/CompareScreen";
import ApplicationsScreen from "./src/screens/ApplicationsScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app"; // Fixed import

// Remove manual firebaseConfig and initializeApp (auto-init via plugins/files)
// If manual init needed (e.g., for custom app), add back with matching apiKey from plist/json

// Notification handler (removed non-standard props; use defaults or iOS-specific if needed)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request push notification permissions
async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "creditcard-app", // Fixed: Use app slug or actual Expo project ID from dashboard
    })
  ).data;
  // Send token to backend if needed
}

const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Survey" component={SurveyScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#000000" },
      tabBarActiveTintColor: "#00FF00",
      tabBarInactiveTintColor: "#FFFFFF",
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Cards"
      component={CardsListScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="credit-card" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Applications"
      component={ApplicationsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons
            name="file-document"
            color={color}
            size={26}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

const RootStack = createStackNavigator();
const RootNavigator = () => {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    registerForPushNotificationsAsync();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        },
        trigger: null,
      });
    });
    return unsubscribe;
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen name="CardDetails" component={CardDetailsScreen} />
          <RootStack.Screen name="Compare" component={CompareScreen} />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const App = () => (
  <Provider store={store}>
    <AuthContextProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthContextProvider>
  </Provider>
);

export default App;
