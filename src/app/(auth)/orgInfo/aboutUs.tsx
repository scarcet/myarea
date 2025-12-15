import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text className="text-lg font-bold ml-3">About Us</Text>
      </View>

      {/* Content */}
      <ScrollView className="px-5 py-4">

        {/* Intro */}
        <Text className="text-gray-900 text-lg font-bold mb-3">
          Welcome to Our Community App
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-6">
          Our platform is built to strengthen community bonds by helping people
          connect with those who live around them. We believe real connection
          starts locally — with neighbors, friends, and the people who share the
          same streets and stories.
        </Text>

        {/* Mission */}
        <Text className="text-black font-bold text-xl mb-2">Our Mission</Text>
        <Text className="text-gray-700 text-base leading-6 mb-6">
          To bring people living in a local community together and promote
          unity, culture, and community development.
        </Text>

        {/* Vision */}
        <Text className="text-black font-bold text-xl mb-2">Our Vision</Text>
        <Text className="text-gray-700 text-base leading-6 mb-6">
          To be the world’s first digital social media app that allows users to
          connect physically with their local community.
        </Text>

        {/* Values */}
        <Text className="text-black font-bold text-xl mb-2">What We Stand For</Text>
        <Text className="text-gray-700 text-base leading-6 mb-6">
          • **Real Connections** — Encouraging face-to-face interaction, not just online activity.
          {"\n"}• **Community Growth** — Supporting local events, culture, and initiatives.
          {"\n"}• **Safety & Trust** — Creating a positive and respectful environment for all users.
          {"\n"}• **Inclusivity** — Everyone is welcome, and every voice matters.
        </Text>

        {/* Footer */}
        <Text className="text-gray-500 text-sm italic mb-10">
          Together, we aim to create stronger, more united communities —
          one neighborhood at a time.
        </Text>
      </ScrollView>
    </View>
  );
}
