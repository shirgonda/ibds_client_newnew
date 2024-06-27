import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, FlatList, StyleSheet } from "react-native";
import RegisterForPushNotificationsAsync from "./PushNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PushPage() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [schedule, setSchedule] = useState([
    { id: "1", title: "Meeting", date: new Date("2024-05-24T14:00:00") },
    {
      id: "2",
      title: "Doctor Appointment",
      date: new Date("2024-05-24T15:00:00"),
    },
    { id: "3", title: "Dinner", date: new Date("2024-05-24T18:00:00") },
  ]);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    RegisterForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
        }
      })
      .catch((error) => {
        console.error("Error getting token:", error);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendPushNotification = async (expoPushToken, title, body, data) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const dataResponse = await response.json();
    console.log("Push notification response:", dataResponse);
  };

  const schedulePushNotification = (expoPushToken, date) => {
    const now = new Date();
    const delay = date - now;

    if (delay > 0) {
      setTimeout(async () => {
        await sendPushNotification(
          expoPushToken,
          "Reminder",
          "This is your scheduled notification!",
          { someData: "goes here" }
        );
      }, delay);
    } else {
      console.error("The scheduled time is in the past");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokenText}>הטוקן שלך: {expoPushToken}</Text>
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationTitle}>
          כותרת: {notification && notification.request.content.title}
        </Text>
        <Text style={styles.notificationBody}>
          גוף: {notification && notification.request.content.body}
        </Text>
        <Text style={styles.notificationData}>
          נתונים:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <FlatList
        data={schedule}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleText}>
              {item.title} - {item.date.toString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Schedule Notification for 2024-05-23T19:32:00"
        onPress={() =>
          schedulePushNotification(
            expoPushToken,
            new Date("2024-05-23T19:33:00")
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  tokenText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  notificationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationBody: {
    fontSize: 16,
  },
  notificationData: {
    fontSize: 14,
    color: "#555",
  },
  scheduleItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scheduleText: {
    fontSize: 16,
  },
});