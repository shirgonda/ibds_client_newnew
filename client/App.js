import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StyleSheet,Alert,LogBox } from "react-native";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
//import ResatPassword from "./pages/ResatPassword";
import Register from "./pages/Register";
import Calendar from "./pages/Calendar";
import RightsCalculator from "./pages/RightsCalculator";
import PersonalArea from "./pages/PersonalArea";
import AddEventToCalendar from "./pages/AddEventToCalendar";
import EditEvent from "./pages/EditEvent";
import AddAlert from "./pages/AddAlert";
import EditAlert from "./pages/EditAlert";
import ForumSubjects from "./pages/ForumSubjects";
import MoreInfo from "./pages/MoreInfo";
import Chat from "./pages/Chat";
import Forum1 from "./pages/Forum1";
import PublishQuestion from "./pages/PublishQuestion";
import MyDocuments from "./pages/MyDocuments";
import FolderPage from "./pages/FolderPage";
import MyFriends from "./pages/MyFriends";
import IntoChat from "./pages/IntoChat";
import PrivacyAndTerms from "./pages/PrivacyAndTerms";
import Mail from "./pages/Mail";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./components/UserContext";
import AppHeader from "./components/Header";
import "react-native-reanimated";
import RightsList from "./pages/RightsList";
import sendNotification from "./pages/sendNotification";
import PushNotifications from "./pages/PushNotifications";
import * as Notifications from "expo-notifications";
import RegisterForPushNotificationsAsync from "./pages/PushNotifications";
import { PostOneValue } from './api';

LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

Notifications.setNotificationHandler({ 
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false, }), 
});

export default function App({ navigation }) {
var mailsArr=[];

    useEffect(() => {
    RegisterForPushNotificationsAsync()
      .then((token) => {
        console.log("Token received:", token);
      })
      .catch((error) => {
        console.error("Error getting token:", error);
      });

    Notifications.addNotificationReceivedListener(async(notification) => {
      console.log("Notification received:", notification);
      var MailsToSend=notification.request.content.data.mails;
      var firstMail=notification.request.content.data.randNum+1;
      if(firstMail==2){
        var notAddToArray=false;
        mailsArr.forEach((m) => {
           if(m.mailid==MailsToSend.calendarEventId){
            notAddToArray=true;
          }
        });
        if(!notAddToArray){
          PostMail(MailsToSend);
        }
      }
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });  
  }, []);


  async function PostMail(mail){
    let result= await PostOneValue(`api/Mail`, mail);
    if(!result){
        Alert.alert('הוספת אימייל נכשלה');
        console.log('result',result);
    } 
    else{
      console.log('Add mail successful:', result);
      mailsArr.push(mail);
    }
    mailsArr.push(mail);
}

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: () => {
              <AppHeader navigation={navigation} />;
            },
            headerStyle: {
              shadowOpacity: 0,
            },
            headerTintColor: "#50436E",
          }}
        >
          <Stack.Screen
            name="login"
            component={LogIn}
            options={{ title: " " }}
          />
          {/* <Stack.Screen
            name="ResatPassword"
            component={ResatPassword}
            options={{ title: " " }}
          /> */}
          <Stack.Screen
            name="register"
            component={Register}
            options={{ title: " " }}
          />
          <Stack.Screen name="home" component={Home} options={{ title: " " }} />
          <Stack.Screen
            name="Calendar"
            component={Calendar}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="AddEventToCalendar"
            component={AddEventToCalendar}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="AddAlert"
            component={AddAlert}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="EditAlert"
            component={EditAlert}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="PersonalArea"
            component={PersonalArea}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEvent}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="RightsCalculator"
            component={RightsCalculator}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="RightsList"
            component={RightsList}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="ForumSubjects"
            component={ForumSubjects}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="MoreInfo"
            component={MoreInfo}
            options={{ title: " " }}
          />
          <Stack.Screen 
            name="Chat" 
            component={Chat} 
            options={{ title: " " }} 
          />
          <Stack.Screen 
            name="IntoChat" 
            component={IntoChat} 
            options={{ title: " " }} 
          />
          <Stack.Screen 
            name="Mail" 
            component={Mail} 
            options={{ title: " " }} 
          />
          <Stack.Screen
            name="Forum1"
            component={Forum1}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="PublishQuestion"
            component={PublishQuestion}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="MyDocuments"
            component={MyDocuments}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="FolderPage"
            component={FolderPage}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="MyFriends"
            component={MyFriends}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="PrivacyAndTerms"
            component={PrivacyAndTerms}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="sendNotification"
            component={sendNotification}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="PushNotifications"
            component={PushNotifications}
            options={{ title: " " }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
});
