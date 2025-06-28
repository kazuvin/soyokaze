import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  type ViewProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, ZIndex, Shadow } from '@/constants/design-tokens';

type HeaderProps = ViewProps & {
  title?: string;
  children?: React.ReactNode;
  enableBlur?: boolean;
  scrollY?: SharedValue<number>;
  blurIntensity?: number;
  showShadow?: boolean;
  height?: number;
};

export function Header({
  title,
  children,
  enableBlur = false,
  scrollY,
  blurIntensity = 50,
  showShadow = true,
  height = 88,
  style,
  ...rest
}: HeaderProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY || !enableBlur) return {};

    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      'clamp'
    );

    return {
      opacity,
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    if (!scrollY || !showShadow) return {};

    const shadowOpacity = interpolate(
      scrollY.value,
      [0, 20],
      [0, Shadow.sm.shadowOpacity],
      'clamp'
    );

    return {
      ...Shadow.sm,
      shadowOpacity,
    };
  });

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {title && (
        <ThemedText style={styles.title}>
          {title}
        </ThemedText>
      )}
      {children}
    </View>
  );

  if (enableBlur && Platform.OS === 'ios') {
    return (
      <Animated.View
        style={[
          styles.container,
          { height, zIndex: ZIndex[50] },
          shadowStyle,
          style,
        ]}
        {...rest}
      >
        <ThemedView style={[styles.baseHeader, { height }]}>
          {renderContent()}
        </ThemedView>
        
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            animatedStyle,
          ]}
        >
          <BlurView
            intensity={blurIntensity}
            style={StyleSheet.absoluteFill}
          >
            <View
              style={[
                styles.blurOverlay,
                {
                  backgroundColor: `${backgroundColor}80`,
                  borderBottomColor: `${borderColor}20`,
                },
              ]}
            />
          </BlurView>
          {renderContent()}
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          height, 
          zIndex: ZIndex[50],
          backgroundColor,
        },
        enableBlur && animatedStyle,
        shadowStyle,
        style,
      ]}
      {...rest}
    >
      <ThemedView style={[styles.baseHeader, { height }]}>
        {renderContent()}
      </ThemedView>
      
      {enableBlur && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: `${backgroundColor}E6`,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: `${borderColor}30`,
            },
            animatedStyle,
          ]}
        >
          {renderContent()}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  baseHeader: {
    paddingTop: Platform.select({
      ios: Spacing[12],
      android: Spacing[6],
      default: Spacing[6],
    }),
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[2],
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing[2],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  blurOverlay: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

// Export helper hook for scroll handling
export function useHeaderScrollHandler() {
  return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet';
    return event.nativeEvent.contentOffset.y;
  };
}