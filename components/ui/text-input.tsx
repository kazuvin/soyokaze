import { TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps, TouchableOpacity } from "react-native";
import { TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette, Spacing, BorderRadius } from "@/constants/design-tokens";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { SymbolName } from "@/components/ui/icon-symbol";

export type TextInputVariant = "base" | "borderless";
export type TextInputSize = "small" | "medium" | "large";

export type TextInputProps = RNTextInputProps & {
  variant?: TextInputVariant;
  size?: TextInputSize;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leadingIcon?: SymbolName;
  trailingIcon?: SymbolName;
  onTrailingIconPress?: () => void;
};

export function TextInput({
  variant = "base",
  size = "medium",
  label,
  error,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
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
    const basePadding = {
      small: Spacing[3],
      medium: Spacing[3],
      large: Spacing[4],
    }[size];

    const iconPadding = {
      small: Spacing[8],
      medium: Spacing[9],
      large: Spacing[10],
    }[size];

    switch (size) {
      case "small":
        return {
          height: 32,
          paddingHorizontal: leadingIcon || trailingIcon ? 0 : basePadding,
          paddingLeft: leadingIcon ? iconPadding : basePadding,
          paddingRight: trailingIcon ? iconPadding : basePadding,
          fontSize: TypographyStyles.bodySmall.fontSize,
        };
      case "large":
        return {
          height: 48,
          paddingHorizontal: leadingIcon || trailingIcon ? 0 : basePadding,
          paddingLeft: leadingIcon ? iconPadding : basePadding,
          paddingRight: trailingIcon ? iconPadding : basePadding,
          fontSize: TypographyStyles.bodyLarge.fontSize,
        };
      case "medium":
      default:
        return {
          height: 40,
          paddingHorizontal: leadingIcon || trailingIcon ? 0 : basePadding,
          paddingLeft: leadingIcon ? iconPadding : basePadding,
          paddingRight: trailingIcon ? iconPadding : basePadding,
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

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 20;
      case "medium":
      default:
        return 18;
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
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            height: getSizeStyles().height,
            ...getVariantStyles(),
          },
          fullWidth && { width: "100%" },
        ]}
      >
        {leadingIcon && (
          <IconSymbol
            name={leadingIcon}
            size={getIconSize()}
            color={theme.text.secondary}
            style={{
              position: "absolute",
              left: Spacing[3],
              zIndex: 1,
            }}
          />
        )}
        <RNTextInput
          style={[
            {
              flex: 1,
              color: theme.text.primary,
              fontSize: getSizeStyles().fontSize,
              paddingLeft: getSizeStyles().paddingLeft,
              paddingRight: getSizeStyles().paddingRight,
              height: getSizeStyles().height,
              textAlignVertical: "center",
            },
            style,
          ]}
          placeholderTextColor={theme.text.secondary}
          {...rest}
        />
        {trailingIcon && (
          <TouchableOpacity
            onPress={onTrailingIconPress}
            style={{
              position: "absolute",
              right: Spacing[2],
              padding: Spacing[1],
              zIndex: 1,
            }}
            disabled={!onTrailingIconPress}
          >
            <IconSymbol
              name={trailingIcon}
              size={getIconSize()}
              color={theme.text.secondary}
            />
          </TouchableOpacity>
        )}
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