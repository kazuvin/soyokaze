import { View, type ViewProps } from "react-native";
import { ComponentStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";

export type CardVariant = "elevated" | "flat" | "outlined";

export type CardProps = ViewProps & {
  variant?: CardVariant;
  padding?: "none" | "small" | "medium" | "large";
};

export function Card({
  variant = "elevated",
  padding = "medium",
  style,
  children,
  ...rest
}: CardProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          ...ComponentStyles.cardElevated,
          backgroundColor: theme.background.elevated,
        };
      case "flat":
        return {
          ...ComponentStyles.cardFlat,
          backgroundColor: theme.background.elevated,
          borderColor: theme.border.primary,
        };
      case "outlined":
        return {
          ...ComponentStyles.cardFlat,
          backgroundColor: "transparent",
          borderColor: theme.border.primary,
        };
      default:
        return {};
    }
  };

  const getPaddingOverride = () => {
    switch (padding) {
      case "none":
        return { padding: 0 };
      case "small":
        return { padding: 12 };
      case "large":
        return { padding: 24 };
      case "medium":
      default:
        return {};
    }
  };

  return (
    <View style={[getVariantStyles(), getPaddingOverride(), style]} {...rest}>
      {children}
    </View>
  );
}

