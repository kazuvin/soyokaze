import { View, type ViewProps } from "react-native";
import { ComponentStyles } from "@/constants/styles";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

export type CardVariant = "elevated" | "flat" | "outlined";

export type CardProps = ViewProps & {
  variant?: CardVariant;
};

export type CardHeaderProps = ViewProps;

export type CardTitleProps = ViewProps & {
  children: React.ReactNode;
};

export type CardContentProps = ViewProps;

export function Card({
  variant = "elevated",
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

  return (
    <View style={[getVariantStyles(), style]} {...rest}>
      {children}
    </View>
  );
}

export function CardHeader({
  style,
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <View style={[{ paddingBottom: 16 }, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardTitle({
  style,
  children,
  ...rest
}: CardTitleProps) {
  return (
    <View style={[style]} {...rest}>
      <ThemedText type="h6">{children}</ThemedText>
    </View>
  );
}

export function CardContent({
  style,
  children,
  ...rest
}: CardContentProps) {
  return (
    <View style={[{ padding: 16 }, style]} {...rest}>
      {children}
    </View>
  );
}

