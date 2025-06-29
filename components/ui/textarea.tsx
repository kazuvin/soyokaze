import { TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps } from "react-native";
import { TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette, Spacing, BorderRadius } from "@/constants/design-tokens";

export type TextareaVariant = "base" | "borderless";
export type TextareaSize = "small" | "medium" | "large";

export type TextareaProps = RNTextInputProps & {
  variant?: TextareaVariant;
  size?: TextareaSize;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
};

export function Textarea({
  variant = "base",
  size = "medium",
  label,
  error,
  fullWidth = false,
  rows = 4,
  style,
  ...rest
}: TextareaProps) {
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
    const basePadding = {
      small: Spacing[3],
      medium: Spacing[3],
      large: Spacing[4],
    }[size];

    const lineHeight = {
      small: 20,
      medium: 24,
      large: 28,
    }[size];

    const minHeight = lineHeight * rows;

    switch (size) {
      case "small":
        return {
          minHeight,
          padding: basePadding,
          fontSize: TypographyStyles.bodySmall.fontSize,
          lineHeight,
        };
      case "large":
        return {
          minHeight,
          padding: basePadding,
          fontSize: TypographyStyles.bodyLarge.fontSize,
          lineHeight,
        };
      case "medium":
      default:
        return {
          minHeight,
          padding: basePadding,
          fontSize: TypographyStyles.body.fontSize,
          lineHeight,
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
      <View
        style={[
          {
            borderRadius: BorderRadius.md,
            ...getVariantStyles(),
          },
          fullWidth && { width: "100%" },
        ]}
      >
        <RNTextInput
          style={[
            {
              color: theme.text.primary,
              fontSize: getSizeStyles().fontSize,
              lineHeight: getSizeStyles().lineHeight,
              minHeight: getSizeStyles().minHeight,
              padding: getSizeStyles().padding,
              textAlignVertical: "top",
            },
            style,
          ]}
          placeholderTextColor={theme.text.secondary}
          multiline={true}
          numberOfLines={rows}
          {...rest}
        />
      </View>
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