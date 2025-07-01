import { TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps } from "react-native";
import { TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { useJournalFont } from "@/hooks/use-journal-font";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette, Spacing, BorderRadius } from "@/constants/design-tokens";

export type JournalTextareaVariant = "base" | "borderless";
export type JournalTextareaSize = "small" | "medium" | "large";

export type JournalTextareaProps = RNTextInputProps & {
  variant?: JournalTextareaVariant;
  size?: JournalTextareaSize;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
};

export function JournalTextarea({
  variant = "base",
  size = "medium",
  label,
  error,
  fullWidth = false,
  rows = 6,
  style,
  value,
  ...rest
}: JournalTextareaProps) {
  const { theme } = useTheme();
  const { fontFamily } = useJournalFont(value);

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
      medium: Spacing[4],
      large: Spacing[5],
    }[size];

    const lineHeight = {
      small: 22,
      medium: 26,
      large: 30,
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
              fontFamily,
            },
            style,
          ]}
          placeholderTextColor={theme.text.secondary}
          multiline={true}
          numberOfLines={rows}
          value={value}
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