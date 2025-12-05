import { router, Tabs } from "expo-router";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { View } from 'react-native';
import NotificationProvider from '@/providers/NotificationProvider';
import { useAuth } from "@/providers/AuthProvider";

export default function TabLayout() {
  const { profile } = useAuth();
  const homeTitle = profile?.area ? `Home - ${profile.area}` : "Home";
  const streetTitle = profile?.street ? `${profile.street} - Street` : "Street";
  return (
    <NotificationProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarShowLabel: false,
        
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: homeTitle,
          headerShown: false,
          headerTintColor: "#33adff",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myArea"
        options={{
          title: streetTitle,
          tabBarIcon: ({ color }) => <Feather name="map-pin" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <AntDesign name="plus" size={24} color={color} />,
          //headerShown: false,
          //tabBarStyle: { display: 'none' }
          
        }}

        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/new');
          },
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People in your area',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />

        }}
      />
      
      <Tabs.Screen
        name="privatechat"
        options={{
          title: 'pchat',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tabs>
    </NotificationProvider>
  )
}