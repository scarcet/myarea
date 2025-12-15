import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TermsScreen() {
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
        <Text className="text-lg font-bold ml-3">Terms & Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView className="px-5 py-4">
        <Text className="text-gray-900 text-base font-semibold mb-2">
          Last Updated: [Insert Date]
        </Text>

        <Text className="text-gray-700 text-base leading-6 mb-4">
          Welcome to our platform. By creating an account or using our services,
          you agree to the following Terms and Conditions. Please read them
          carefully.
        </Text>

        {/* Section 1 */}
        <Text className="text-black font-bold text-lg mb-2">
          1. Purpose of Data Collection
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          We collect and process user information solely for:
          {"\n"}• Creating and maintaining your profile
          {"\n"}• Supporting social features such as posts, likes, comments, and messaging
          {"\n"}• Improving user experience and platform functionality
          {"\n"}• Ensuring community safety
          {"\n\n"}
          We do not sell, rent, or share your personal data with third parties
          for unrelated purposes.
        </Text>

        {/* Section 2 */}
        <Text className="text-black font-bold text-lg mb-2">
          2. User Responsibilities
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          By using our app, you agree to:
          {"\n"}• Provide accurate and truthful information
          {"\n"}• Use the platform respectfully
          {"\n"}• Not impersonate others or misrepresent your identity
          {"\n"}• Keep your login information secure
        </Text>

        {/* Section 3 */}
        <Text className="text-black font-bold text-lg mb-2">
          3. Social Interactions & Safety
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          This app allows interaction with other users, including messaging and
          sharing content. You are solely responsible for your interactions.
          {"\n\n"}
          The company is not liable for:
          {"\n"}• Unsolicited messages from other users
          {"\n"}• Loss or damages resulting from user interactions
          {"\n"}• Actions of individuals outside our control
        </Text>

        {/* Section 4 */}
        <Text className="text-black font-bold text-lg mb-2">
          4. User-Generated Content
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          You retain ownership of your content but grant us a license to display
          it within the app. You agree not to upload illegal, abusive,
          inappropriate, or copyrighted material you do not own.
        </Text>

        {/* Section 5 */}
        <Text className="text-black font-bold text-lg mb-2">
          5. Account Termination
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          We reserve the right to suspend or terminate accounts that violate
          these terms or misuse the platform. You may delete your account at any
          time.
        </Text>

        {/* Section 6 */}
        <Text className="text-black font-bold text-lg mb-2">
          6. Limitation of Liability
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          We are not responsible for damages or losses resulting from interactions
          with other users or information you voluntarily share. The service is
          provided "as is" without warranties of any kind.
        </Text>

        {/* Section 7 */}
        <Text className="text-black font-bold text-lg mb-2">
          7. Changes to Terms
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-4">
          We may update these Terms occasionally. Continued use of the app means
          you accept the updated Terms.
        </Text>

        {/* Section 8 */}
        <Text className="text-black font-bold text-lg mb-2">
          8. Acceptance of Terms
        </Text>
        <Text className="text-gray-700 text-base leading-6 mb-10">
          By creating an account or using the app, you confirm that you have read,
          understood, and agreed to these Terms. If you do not agree, please stop
          using the app.
        </Text>
      </ScrollView>
    </View>
  );
}
