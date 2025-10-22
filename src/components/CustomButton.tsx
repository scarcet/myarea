import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet,} from 'react-native';
import { COLORS } from "../constants/theme";

type CustomButtonProps = {
  text: string;
} & TouchableOpacityProps;

export default function CustomButton({ text, ...props }: CustomButtonProps) {
  return (
<TouchableOpacity
{...props} style={[styles.button]}
activeOpacity={0.9}
>
<Text style={styles.buttonText}>{text}</Text>
</TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});