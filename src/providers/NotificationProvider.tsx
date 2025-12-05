import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";
import { PropsWithChildren } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationProvider({ children }: PropsWithChildren) {
    const [expoPushToken, setExpoPushToken] = useState<string>("");
  
    // ✅ Correct event subscription type
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const { user } = useAuth();

  /** Register + set listeners */
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token || ""))
      .catch((error) => setExpoPushToken(String(error)));

    // Notification received (foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // User tapped on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  /** Save token to Supabase */
  useEffect(() => {
    if (expoPushToken) saveUserPushToken();
  }, [expoPushToken]);

  const saveUserPushToken = async () => {
    if (!user?.id || !expoPushToken) return;

    await supabase
      .from("profiles")
      .update({ push_token: expoPushToken }) //  your old code incorrectly set id inside update()
      .eq("id", user.id);
  };

  return children;
}

/** ERROR HANDLER */
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

/** REGISTER FOR PUSH NOTIFICATIONS */
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.log("Must use a physical device for push notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    handleRegistrationError(
      "Permission not granted for push notifications!"
    );
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    handleRegistrationError("Project ID not found");
    return;
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("PUSH TOKEN:", token);
    return token;
  } catch (err) {
    handleRegistrationError(String(err));
  }
}
