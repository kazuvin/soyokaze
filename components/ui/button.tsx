import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { ComponentStyles, TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette } from "@/constants/design-tokens";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  title,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled
            ? ColorPalette.neutral[300]
            : theme.brand.primary,
        };
      case "secondary":
        return {
          backgroundColor: disabled
            ? ColorPalette.neutral[200]
            : theme.background.secondary,
          borderWidth: 1,
          borderColor: theme.border.primary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled
            ? ColorPalette.neutral[300]
            : theme.brand.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return ComponentStyles.buttonSmall;
      case "large":
        return ComponentStyles.buttonLarge;
      case "medium":
      default:
        return ComponentStyles.buttonBase;
    }
  };

  const getTextColor = () => {
    if (disabled) return ColorPalette.neutral[500];

    switch (variant) {
      case "primary":
        return "#ffffff";
      case "secondary":
        return theme.text.primary;
      case "outline":
        return theme.brand.primary;
      case "ghost":
        return theme.brand.primary;
      default:
        return theme.text.primary;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "small":
        return TypographyStyles.buttonSmall;
      case "large":
        return TypographyStyles.buttonLarge;
      case "medium":
      default:
        return TypographyStyles.button;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getSizeStyles(),
        getVariantStyles(),
        fullWidth && { width: "100%" },
        disabled && { opacity: 0.6 },
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      <ThemedText style={[getTextStyle(), { color: getTextColor() }]}>
        {loading ? "Loading..." : title}
      </ThemedText>
    </TouchableOpacity>
  );
}

