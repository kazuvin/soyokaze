import { View, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { BorderRadius, Spacing, Opacity } from "@/constants/design-tokens";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export type SkeletonProps = ViewProps & {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number;
  animation?: boolean;
  lines?: number;
};

export function Skeleton({
  variant = "rectangular",
  width = "100%",
  height = 20,
  animation = true,
  lines = 1,
  style,
  ...rest
}: SkeletonProps) {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [animation, pulseAnim]);

  const getVariantStyles = () => {
    switch (variant) {
      case "text":
        return {
          height: height,
          borderRadius: BorderRadius.sm,
        };
      case "circular":
        return {
          width: height,
          height: height,
          borderRadius: BorderRadius.full,
        };
      case "rectangular":
      default:
        return {
          height: height,
          borderRadius: BorderRadius.md,
        };
    }
  };

  const animatedStyle = animation
    ? {
        opacity: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [Opacity[30], Opacity[10]],
        }),
      }
    : {};

  const baseStyle = {
    backgroundColor: theme.background.secondary,
    width: width,
    ...getVariantStyles(),
    ...animatedStyle,
  };

  if (variant === "text" && lines > 1) {
    return (
      <View style={[{ gap: Spacing[2] }, style]} {...rest}>
        {Array.from({ length: lines }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              baseStyle,
              index === lines - 1 && { width: "75%" },
            ]}
          />
        ))}
      </View>
    );
  }

  return <Animated.View style={[baseStyle, style]} {...rest} />;
}