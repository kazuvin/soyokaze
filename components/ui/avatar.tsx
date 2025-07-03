import React from 'react';
import { View, Image, type ViewStyle, type ImageStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, Typography, ColorPalette } from '@/constants/design-tokens';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  style?: ViewStyle;
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  style,
}: AvatarProps) {
  const { theme } = useTheme();
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'xs':
        return {
          width: 24,
          height: 24,
          borderRadius: BorderRadius.full,
        };
      case 'sm':
        return {
          width: 32,
          height: 32,
          borderRadius: BorderRadius.full,
        };
      case 'md':
        return {
          width: 40,
          height: 40,
          borderRadius: BorderRadius.full,
        };
      case 'lg':
        return {
          width: 48,
          height: 48,
          borderRadius: BorderRadius.full,
        };
      case 'xl':
        return {
          width: 56,
          height: 56,
          borderRadius: BorderRadius.full,
        };
      case '2xl':
        return {
          width: 64,
          height: 64,
          borderRadius: BorderRadius.full,
        };
      default:
        return {
          width: 40,
          height: 40,
          borderRadius: BorderRadius.full,
        };
    }
  };

  const getFallbackTextSize = (): number => {
    switch (size) {
      case 'xs':
        return Typography.fontSize.xs;
      case 'sm':
        return Typography.fontSize.sm;
      case 'md':
        return Typography.fontSize.base;
      case 'lg':
        return Typography.fontSize.lg;
      case 'xl':
        return Typography.fontSize.xl;
      case '2xl':
        return Typography.fontSize['2xl'];
      default:
        return Typography.fontSize.base;
    }
  };

  const sizeStyles = getSizeStyles();
  const fallbackTextSize = getFallbackTextSize();

  const containerStyle: ViewStyle = {
    ...sizeStyles,
    backgroundColor: theme.background.secondary,
    borderWidth: 1,
    borderColor: theme.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: sizeStyles.borderRadius as number,
  };

  // Get initials from fallback text
  const getInitials = (text: string): string => {
    if (!text) return '';
    
    const words = text.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return words
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <View style={[containerStyle, style]}>
      {src ? (
        <Image
          source={{ uri: src }}
          style={imageStyle}
          accessibilityLabel={alt}
        />
      ) : (
        <ThemedText
          style={{
            fontSize: fallbackTextSize,
            fontWeight: Typography.fontWeight.medium,
            color: theme.text.primary,
          }}
        >
          {getInitials(fallback || alt || '')}
        </ThemedText>
      )}
    </View>
  );
}

export type AvatarGroupProps = {
  children: React.ReactNode;
  spacing?: number;
  max?: number;
  style?: ViewStyle;
};

export function AvatarGroup({
  children,
  spacing = -Spacing[2],
  max,
  style,
}: AvatarGroupProps) {
  const { theme } = useTheme();
  
  const childrenArray = React.Children.toArray(children);
  const displayChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max && childrenArray.length > max ? childrenArray.length - max : 0;

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {displayChildren.map((child, index) => (
        <View
          key={index}
          style={{
            marginLeft: index > 0 ? spacing : 0,
            zIndex: displayChildren.length - index,
          }}
        >
          {child}
        </View>
      ))}
      {remainingCount > 0 && (
        <View
          style={{
            marginLeft: spacing,
            zIndex: 0,
          }}
        >
          <Avatar
            fallback={`+${remainingCount}`}
            size="md"
            style={{
              backgroundColor: ColorPalette.neutral[200],
              borderColor: theme.border.primary,
            }}
          />
        </View>
      )}
    </View>
  );
}