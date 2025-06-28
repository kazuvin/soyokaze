import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  type ViewProps,
  type ScrollViewProps,
  type TouchableOpacityProps,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { TypographyStyles } from '@/constants/styles';
import { ColorPalette, Spacing, BorderRadius } from '@/constants/design-tokens';

// Context for managing tab state
type TabsContextType = {
  activeTab: string;
  onTabChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

// Type definitions
export type TabsProps = ViewProps & {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

export type TabsListProps = ScrollViewProps & {
  children: React.ReactNode;
};

export type TabsTriggerProps = TouchableOpacityProps & {
  value: string;
  children: React.ReactNode;
};

export type TabsContentProps = ViewProps & {
  value: string;
  children: React.ReactNode;
};

// Main Tabs component
export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  style,
  ...rest
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const handleTabChange = useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

// TabsList component with horizontal scrolling
export function TabsList({ children, style, ...rest }: TabsListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: Spacing[4],
        gap: Spacing[2],
        alignItems: 'center',
      }}
      style={[
        {
          flexGrow: 0,
          paddingVertical: Spacing[2],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

// TabsTrigger component with badge styling
export function TabsTrigger({
  value,
  children,
  style,
  disabled,
  ...rest
}: TabsTriggerProps) {
  const { activeTab, onTabChange } = useTabsContext();
  const isActive = activeTab === value;

  const getBadgeStyles = () => {
    if (isActive) {
      return {
        backgroundColor: ColorPalette.neutral[900],
        borderColor: ColorPalette.neutral[900],
      };
    }
    return {
      backgroundColor: ColorPalette.neutral[100],
      borderColor: ColorPalette.neutral[200],
    };
  };

  const getTextColor = () => {
    if (disabled) return ColorPalette.neutral[400];
    if (isActive) return '#ffffff';
    return ColorPalette.neutral[700];
  };

  return (
    <TouchableOpacity
      style={[
        {
          borderRadius: BorderRadius.full,
          paddingVertical: Spacing[2],
          paddingHorizontal: Spacing[4],
          minHeight: 36,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        },
        getBadgeStyles(),
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={() => !disabled && onTabChange(value)}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      {...rest}
    >
      <ThemedText
        style={[
          TypographyStyles.label,
          { color: getTextColor() },
        ]}
      >
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}

// TabsContent component
export function TabsContent({
  value,
  children,
  style,
  ...rest
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: Spacing[4],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}