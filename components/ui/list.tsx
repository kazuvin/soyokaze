import React from 'react';
import {
  View,
  TouchableOpacity,
  type ViewProps,
  type TouchableOpacityProps,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { SymbolName } from '@/components/ui/icon-symbol';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BorderRadius } from '@/constants/design-tokens';

// Type definitions
export type ListProps = ViewProps & {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
};

export type ListItemProps = TouchableOpacityProps & {
  children: React.ReactNode;
  disabled?: boolean;
};

export type ListItemTextProps = ViewProps & {
  primary: string;
  secondary?: string;
  primaryProps?: React.ComponentProps<typeof ThemedText>;
  secondaryProps?: React.ComponentProps<typeof ThemedText>;
};

export type ListItemIconProps = ViewProps & {
  name: SymbolName;
  size?: number;
  color?: string;
};

export type ListItemActionProps = ViewProps & {
  children: React.ReactNode;
};

export type ListSeparatorProps = ViewProps & {
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  height?: number;
  marginVertical?: number;
};

export type ListLabelProps = ViewProps & {
  children: string;
  variant?: 'default' | 'secondary';
};

// Main List component
export function List({
  children,
  variant = 'default',
  style,
  ...rest
}: ListProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.background.elevated,
          borderRadius: BorderRadius.lg,
          ...{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          },
        };
      case 'outlined':
        return {
          backgroundColor: theme.background.default,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: theme.border.default,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.background.default,
        };
    }
  };

  return (
    <View
      style={[
        {
          overflow: 'hidden',
        },
        getVariantStyles(),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

// ListItem component with touch feedback
export function ListItem({
  children,
  disabled = false,
  style,
  ...rest
}: ListItemProps) {
  const renderContent = () => (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing[3],
          paddingHorizontal: Spacing[4],
          minHeight: 56,
        },
        disabled && { opacity: 0.6 },
      ]}
    >
      {children}
    </View>
  );

  // If onPress is provided, make it touchable
  if (rest.onPress && !disabled) {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: 'transparent',
          },
          style,
        ]}
        activeOpacity={0.7}
        disabled={disabled}
        accessibilityRole="button"
        {...rest}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Otherwise, render as a regular View
  return (
    <View style={style} {...rest}>
      {renderContent()}
    </View>
  );
}

// ListItemText component for primary and secondary text
export function ListItemText({
  primary,
  secondary,
  primaryProps,
  secondaryProps,
  style,
  ...rest
}: ListItemTextProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
        },
        style,
      ]}
      {...rest}
    >
      <ThemedText
        type="body"
        style={[
          {
            color: theme.text.primary,
            marginBottom: secondary ? 2 : 0,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        {...primaryProps}
      >
        {primary}
      </ThemedText>
      {secondary && (
        <ThemedText
          type="bodySmall"
          style={[
            {
              color: theme.text.secondary,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          {...secondaryProps}
        >
          {secondary}
        </ThemedText>
      )}
    </View>
  );
}

// ListItemIcon component
export function ListItemIcon({
  name,
  size = 24,
  color,
  style,
  ...rest
}: ListItemIconProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          marginRight: Spacing[3],
          justifyContent: 'center',
          alignItems: 'center',
          width: size + 8,
          height: size + 8,
        },
        style,
      ]}
      {...rest}
    >
      <IconSymbol
        name={name}
        size={size}
        color={color || theme.text.primary}
      />
    </View>
  );
}

// ListItemAction component for trailing actions
export function ListItemAction({
  children,
  style,
  ...rest
}: ListItemActionProps) {
  return (
    <View
      style={[
        {
          marginLeft: Spacing[2],
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

// ListSeparator component with various styles
export function ListSeparator({
  variant = 'solid',
  color,
  height = 1,
  marginVertical = 0,
  style,
  ...rest
}: ListSeparatorProps) {
  const { theme } = useTheme();

  const getSeparatorStyle = () => {
    const baseColor = color || theme.border.default;
    const baseStyle = {
      height,
      marginVertical,
      width: '100%',
    };

    switch (variant) {
      case 'dashed':
        // For dashed effect, use border instead of background
        return {
          ...baseStyle,
          borderTopWidth: height,
          borderTopColor: baseColor,
          borderStyle: 'dashed' as const,
          height: 0,
        };
      case 'dotted':
        // For dotted effect, use border instead of background
        return {
          ...baseStyle,
          borderTopWidth: height,
          borderTopColor: baseColor,
          borderStyle: 'dotted' as const,
          height: 0,
        };
      case 'solid':
      default:
        return {
          ...baseStyle,
          backgroundColor: baseColor,
        };
    }
  };

  return (
    <View
      style={[
        getSeparatorStyle(),
        style,
      ]}
      {...rest}
    />
  );
}

// ListLabel component for section headers
export function ListLabel({
  children,
  variant = 'default',
  style,
  ...rest
}: ListLabelProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          color: theme.text.secondary,
          fontSize: 12,
          fontWeight: '500' as const,
        };
      case 'default':
      default:
        return {
          color: theme.text.secondary,
          fontSize: 14,
          fontWeight: '600' as const,
        };
    }
  };

  return (
    <View
      style={[
        {
          paddingVertical: Spacing[2],
          paddingHorizontal: Spacing[4],
          marginTop: Spacing[3],
        },
        style,
      ]}
      {...rest}
    >
      <ThemedText
        style={[
          {
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          },
          getVariantStyles(),
        ]}
      >
        {children}
      </ThemedText>
    </View>
  );
}