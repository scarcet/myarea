import { COLORS } from "../constants/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logoContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  appName: {
    fontSize: 30,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  tagline: {
    padding: 20,
    fontSize: 16,
    color: COLORS.grey,
    letterSpacing: 1,
    marginTop: 0.2,
  },
  areaLogo: {
    width: width * 0.35,
    height: width * 0.35,
    maxHeight: 280,
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  
  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.grey,
    maxWidth: 280,
  },
});


