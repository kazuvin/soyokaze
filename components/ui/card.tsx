import { View, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { Spacing, BorderRadius, Shadow } from "@/constants/design-tokens";

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
          borderRadius: BorderRadius.xl,
          backgroundColor: theme.background.elevated,
          ...Shadow.lg,
        };
      case "flat":
        return {
          borderRadius: BorderRadius.lg,
          backgroundColor: theme.background.elevated,
          borderWidth: 1,
          borderColor: theme.border.primary,
        };
      case "outlined":
        return {
          borderRadius: BorderRadius.lg,
          backgroundColor: "transparent",
          borderWidth: 1,
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
    <View style={[{ paddingTop: Spacing[6], paddingHorizontal: Spacing[6], paddingBottom: Spacing[4] }, style]} {...rest}>
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
    <View style={[{ paddingHorizontal: Spacing[6], paddingBottom: Spacing[6] }, style]} {...rest}>
      {children}
    </View>
  );
}

