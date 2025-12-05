import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Profile",
          headerRight: () => (
            <Ionicons
              name="ellipsis-horizontal"
              size={26}
              color="black"
              style={{ paddingRight: 10 }}
              onPress={() => {
                navigation.setParams({ openMenu: "1" });
              }}
            />
          ),
        })}
      />

      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
