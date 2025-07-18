import { TouchableOpacity, View, type TouchableOpacityProps } from "react-native";
import { ComponentStyles, TypographyStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ColorPalette } from "@/constants/design-tokens";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { SymbolName } from "@/components/ui/icon-symbol";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "overlay" | "remove";
export type ButtonSize = "xs" | "small" | "medium" | "large";

export type ButtonProps = TouchableOpacityProps & {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: SymbolName;
  iconOnly?: boolean;
};

export function Button({
  title,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  icon,
  iconOnly = false,
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
      case "overlay":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 22,
        };
      case "remove":
        return {
          backgroundColor: ColorPalette.error[500],
          borderRadius: 10,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    const baseStyle = (() => {
      switch (size) {
        case "xs":
          return ComponentStyles.buttonXs;
        case "small":
          return ComponentStyles.buttonSmall;
        case "large":
          return ComponentStyles.buttonLarge;
        case "medium":
        default:
          return ComponentStyles.buttonBase;
      }
    })();

    // アイコンのみの場合は正方形にする
    if (iconOnly) {
      return {
        ...baseStyle,
        width: baseStyle.minHeight,
        height: baseStyle.minHeight,
        minWidth: baseStyle.minHeight,
        maxWidth: baseStyle.minHeight,
        maxHeight: baseStyle.minHeight,
        paddingVertical: 0,
        paddingHorizontal: 0,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1, // 強制的に正方形にする
      };
    }

    // 通常のボタンでも高さを固定し、中央揃えを確実にする
    return {
      ...baseStyle,
      height: baseStyle.minHeight,
      maxHeight: baseStyle.minHeight,
      paddingVertical: 0,
      alignItems: 'center',
      justifyContent: 'center',
    };
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
      case "overlay":
        return ColorPalette.neutral[50];
      case "remove":
        return ColorPalette.neutral[50];
      default:
        return theme.text.primary;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "xs":
        return TypographyStyles.buttonXs;
      case "small":
        return TypographyStyles.buttonSmall;
      case "large":
        return TypographyStyles.buttonLarge;
      case "medium":
      default:
        return TypographyStyles.button;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "xs":
        return 12;
      case "small":
        return 16;
      case "large":
        return 24;
      case "medium":
      default:
        return 20;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ThemedText style={[getTextStyle(), { color: getTextColor() }]}>
          Loading...
        </ThemedText>
      );
    }

    if (iconOnly && icon) {
      return (
        <IconSymbol
          name={icon}
          size={getIconSize()}
          color={getTextColor()}
        />
      );
    }

    if (icon && title) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconSymbol
            name={icon}
            size={getIconSize()}
            color={getTextColor()}
          />
          <ThemedText style={[getTextStyle(), { color: getTextColor() }]}>
            {title}
          </ThemedText>
        </View>
      );
    }

    if (title) {
      return (
        <ThemedText style={[getTextStyle(), { color: getTextColor() }]}>
          {title}
        </ThemedText>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[
        getSizeStyles(),
        getVariantStyles(),
        fullWidth && !iconOnly && { width: "100%" },
        disabled && { opacity: 0.6 },
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

