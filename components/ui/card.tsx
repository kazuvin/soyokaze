import { View, TouchableOpacity, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { Spacing, Shadow } from "@/constants/design-tokens";

export type CardVariant = "elevated" | "flat" | "outlined";

export type CardProps = ViewProps & {
  variant?: CardVariant;
  onPress?: () => void;
};

export type CardHeaderProps = ViewProps;

export type CardTitleProps = ViewProps & {
  children: React.ReactNode;
};

export type CardContentProps = ViewProps;

export type CardFooterProps = ViewProps;

export function Card({
  variant = "elevated",
  style,
  children,
  onPress,
  ...rest
}: CardProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          borderRadius: 20,
          backgroundColor: theme.background.elevated,
          ...Shadow.lg,
        };
      case "flat":
        return {
          borderRadius: 20,
          backgroundColor: theme.background.elevated,
          borderWidth: 1,
          borderColor: theme.border.primary,
        };
      case "outlined":
        return {
          borderRadius: 20,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.border.primary,
        };
      default:
        return {};
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[getVariantStyles(), style]} 
        onPress={onPress}
        activeOpacity={0.7}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

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

export function CardFooter({
  style,
  children,
  ...rest
}: CardFooterProps) {
  return (
    <View style={[{ paddingHorizontal: Spacing[6], paddingBottom: Spacing[4], paddingTop: Spacing[3] }, style]} {...rest}>
      {children}
    </View>
  );
}

