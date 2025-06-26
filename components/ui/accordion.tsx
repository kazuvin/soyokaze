import React, { useState } from 'react';
import { View, TouchableOpacity, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/design-tokens';
import { TypographyStyles } from '@/constants/styles';

export type AccordionProps = ViewProps & {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
};

export type AccordionItemProps = ViewProps & {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export type AccordionTriggerProps = ViewProps & {
  children: React.ReactNode;
  disabled?: boolean;
};

export type AccordionContentProps = ViewProps & {
  children: React.ReactNode;
};

type AccordionContextType = {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
  collapsible: boolean;
};

type AccordionItemContextType = {
  value: string;
  isOpen: boolean;
  disabled: boolean;
};

const AccordionContext = React.createContext<AccordionContextType | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
}

export function Accordion({
  children,
  type = 'single',
  collapsible = false,
  defaultValue,
  style,
  ...rest
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        return new Set(defaultValue);
      }
      return new Set([defaultValue]);
    }
    return new Set();
  });

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (type === 'single') {
        if (newSet.has(value)) {
          if (collapsible) {
            newSet.clear();
          }
        } else {
          newSet.clear();
          newSet.add(value);
        }
      } else {
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
      }
      
      return newSet;
    });
  };

  const contextValue: AccordionContextType = {
    openItems,
    toggleItem,
    type,
    collapsible,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <View style={[{ width: '100%' }, style]} {...rest}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  disabled = false,
  children,
  style,
  ...rest
}: AccordionItemProps) {
  const { openItems } = useAccordion();
  const { theme } = useTheme();
  const isOpen = openItems.has(value);

  const contextValue: AccordionItemContextType = {
    value,
    isOpen,
    disabled,
  };

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: theme.border.primary,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  disabled: propDisabled,
  style,
  ...rest
}: AccordionTriggerProps) {
  const { toggleItem } = useAccordion();
  const { value, isOpen, disabled: contextDisabled } = useAccordionItem();
  const { theme } = useTheme();
  
  const disabled = propDisabled || contextDisabled;

  const handlePress = () => {
    if (!disabled) {
      toggleItem(value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing[4],
          paddingHorizontal: 0,
          minHeight: 48,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      {...rest}
    >
      <View style={{ flex: 1, marginRight: Spacing[2] }}>
        {typeof children === 'string' ? (
          <ThemedText
            style={[
              TypographyStyles.bodyMedium,
              {
                color: theme.text.primary,
                fontWeight: '500',
              },
            ]}
          >
            {children}
          </ThemedText>
        ) : (
          children
        )}
      </View>
      <IconSymbol
        name="chevron.down"
        size={16}
        color={theme.text.secondary}
        style={{
          transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
        }}
      />
    </TouchableOpacity>
  );
}

export function AccordionContent({
  children,
  style,
  ...rest
}: AccordionContentProps) {
  const { isOpen } = useAccordionItem();
  const { theme } = useTheme();

  if (!isOpen) {
    return null;
  }

  return (
    <View
      style={[
        {
          paddingBottom: Spacing[4],
          paddingTop: 0,
        },
        style,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <ThemedText
          style={[
            TypographyStyles.body,
            {
              color: theme.text.secondary,
              lineHeight: 24,
            },
          ]}
        >
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </View>
  );
}