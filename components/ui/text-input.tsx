import { TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps } from "react-native";
import { TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette, Spacing, BorderRadius } from "@/constants/design-tokens";

export type TextInputVariant = "base" | "borderless";
export type TextInputSize = "small" | "medium" | "large";

export type TextInputProps = RNTextInputProps & {
  variant?: TextInputVariant;
  size?: TextInputSize;
  label?: string;
  error?: string;
  fullWidth?: boolean;
};

export function TextInput({
  variant = "base",
  size = "medium",
  label,
  error,
  fullWidth = false,
  style,
  ...rest
}: TextInputProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "base":
        return {
          borderWidth: 1,
          borderColor: error ? ColorPalette.error[500] : theme.border.primary,
          backgroundColor: theme.background.secondary,
        };
      case "borderless":
        return {
          borderWidth: 0,
          backgroundColor: "transparent",
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          minHeight: 32,
          paddingHorizontal: Spacing[3],
          paddingVertical: Spacing[2],
          fontSize: TypographyStyles.bodySmall.fontSize,
        };
      case "large":
        return {
          minHeight: 48,
          paddingHorizontal: Spacing[4],
          paddingVertical: Spacing[3],
          fontSize: TypographyStyles.bodyLarge.fontSize,
        };
      case "medium":
      default:
        return {
          minHeight: 40,
          paddingHorizontal: Spacing[3],
          paddingVertical: Spacing[2.5],
          fontSize: TypographyStyles.body.fontSize,
        };
    }
  };

  const getLabelStyle = () => {
    switch (size) {
      case "small":
        return TypographyStyles.captionMedium;
      case "large":
        return TypographyStyles.bodyMedium;
      case "medium":
      default:
        return TypographyStyles.bodySmall;
    }
  };

  return (
    <View style={[fullWidth && { width: "100%" }]}>
      {label && (
        <ThemedText
          style={[
            getLabelStyle(),
            {
              marginBottom: Spacing[2],
              color: error ? ColorPalette.error[500] : theme.text.secondary,
            },
          ]}
        >
          {label}
        </ThemedText>
      )}
      <RNTextInput
        style={[
          {
            borderRadius: BorderRadius.md,
            color: theme.text.primary,
            ...getSizeStyles(),
            ...getVariantStyles(),
          },
          fullWidth && { width: "100%" },
          style,
        ]}
        placeholderTextColor={theme.text.secondary}
        {...rest}
      />
      {error && (
        <ThemedText
          style={[
            TypographyStyles.captionMedium,
            {
              marginTop: Spacing[1],
              color: ColorPalette.error[500],
            },
          ]}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}