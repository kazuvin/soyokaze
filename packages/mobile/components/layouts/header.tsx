import { View, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing, Shadow, ZIndex } from '@/constants/design-tokens';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

type HeaderProps = {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  showBorder?: boolean;
  showShadow?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  fixed?: boolean;
  blurIntensity?: number;
  scrollY?: Animated.Value;
  blurThreshold?: number;
};

export function Header({
  title,
  leftElement,
  rightElement,
  showBorder = true,
  showShadow = true,
  backgroundColor,
  titleColor,
  fixed = false,
  blurIntensity = 50,
  scrollY,
  blurThreshold = 10,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const borderColor = useThemeColor({}, 'border');
  const headerBackgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme();

  const shouldBlur = scrollY && blurThreshold > 0;
  
  const blurOpacity = shouldBlur 
    ? scrollY.interpolate({
        inputRange: [0, blurThreshold],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : undefined;

  const containerStyle = [
    styles.container,
    fixed && styles.fixed,
    {
      paddingTop: insets.top + Spacing[2],
      zIndex: fixed ? ZIndex[50] : ZIndex[0],
    },
    showBorder && { borderBottomColor: borderColor },
    showShadow && Platform.select({
      ios: Shadow.sm,
      android: { elevation: Shadow.sm.elevation },
      default: {},
    }),
  ];

  const ContentWrapper = shouldBlur ? BlurView : ThemedView;
  const contentWrapperProps = shouldBlur
    ? {
        style: [
          containerStyle,
          !backgroundColor && { backgroundColor: 'transparent' },
        ],
        intensity: blurIntensity,
        tint: colorScheme === 'dark' ? 'dark' : 'light',
      }
    : {
        style: [
          containerStyle,
          { backgroundColor: backgroundColor || headerBackgroundColor },
        ],
      };

  return (
    <>
      {shouldBlur && (
        <Animated.View
          style={[
            containerStyle,
            {
              backgroundColor: backgroundColor || headerBackgroundColor,
              opacity: blurOpacity?.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.leftSection}>
              {leftElement}
            </View>
            
            <View style={styles.centerSection}>
              {title && (
                <ThemedText
                  type="h4"
                  style={[
                    styles.title,
                    titleColor && { color: titleColor }
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </ThemedText>
              )}
            </View>
            
            <View style={styles.rightSection}>
              {rightElement}
            </View>
          </View>
        </Animated.View>
      )}
      
      <Animated.View 
        style={[
          shouldBlur && { opacity: blurOpacity },
          shouldBlur && { position: 'absolute', top: 0, left: 0, right: 0, zIndex: ZIndex[50] + 1 }
        ]}
      >
        <ContentWrapper {...contentWrapperProps}>
          <View style={styles.content}>
            <View style={styles.leftSection}>
              {leftElement}
            </View>
            
            <View style={styles.centerSection}>
              {title && (
                <ThemedText
                  type="h4"
                  style={[
                    styles.title,
                    titleColor && { color: titleColor }
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </ThemedText>
              )}
            </View>
            
            <View style={styles.rightSection}>
              {rightElement}
            </View>
          </View>
        </ContentWrapper>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    minHeight: Spacing[12],
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});