import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, BorderRadius, Shadow } from '@/constants/design-tokens';
import type { SymbolName } from '@/components/ui/icon-symbol';

export type DropdownMenuItem = {
  id: string;
  label: string;
  value: string;
  icon?: SymbolName;
  disabled?: boolean;
};

export type DropdownMenuProps = ViewProps & {
  items: DropdownMenuItem[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  width?: number;
};

export type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

export type DropdownMenuContentProps = ViewProps & {
  items: DropdownMenuItem[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  onClose?: () => void;
  width?: number;
  position: { x: number; y: number; width: number };
  visible: boolean;
};

export function DropdownMenuTrigger({ children, onPress }: DropdownMenuTriggerProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function DropdownMenuContent({
  items,
  selectedValue,
  onValueChange,
  onClose,
  width,
  position,
  visible,
  ...rest
}: DropdownMenuContentProps) {
  const { theme } = useTheme();

  const handleItemPress = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    onValueChange?.(item.value);
    onClose?.();
  };

  const renderItem = (item: DropdownMenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing[4],
          paddingVertical: Spacing[3],
          minHeight: 48,
          backgroundColor: selectedValue === item.value ? theme.background.secondary : 'transparent',
        },
        item.disabled && { opacity: 0.5 },
      ]}
      onPress={() => handleItemPress(item)}
      disabled={item.disabled}
      activeOpacity={0.7}
    >
      {item.icon && (
        <IconSymbol
          name={item.icon}
          size={20}
          color={theme.text.primary}
          style={{ marginRight: Spacing[3] }}
        />
      )}
      <ThemedText style={{ flex: 1 }}>
        {item.label}
      </ThemedText>
      {selectedValue === item.value && (
        <IconSymbol
          name="checkmark"
          size={16}
          color={theme.brand.primary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: position.width,
            backgroundColor: theme.background.elevated,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: theme.border.primary,
            ...Shadow.lg,
          }}
          {...rest}
        >
          {items.map(renderItem)}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function DropdownMenu({
  items,
  selectedValue,
  onValueChange,
  children,
  disabled = false,
  width,
  style,
  ...rest
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0, width: 0 });
  const triggerRef = useRef<View>(null);
  const screenHeight = Dimensions.get('window').height;

  const handleOpen = () => {
    if (disabled) return;
    
    triggerRef.current?.measure((fx, fy, width, height, px, py) => {
      const dropdownHeight = items.length * 48;
      const spaceBelow = screenHeight - py - height;
      const spaceAbove = py;
      
      let yPosition = py + height + 4;
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        yPosition = py - dropdownHeight - 4;
      }
      
      setDropdownPosition({
        x: px,
        y: yPosition,
        width: width || 200,
      });
      setIsOpen(true);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={[{ position: 'relative' }, style]} {...rest}>
      <View ref={triggerRef}>
        <DropdownMenuTrigger onPress={handleOpen}>
          <View style={[disabled && { opacity: 0.6 }]}>
            {children}
          </View>
        </DropdownMenuTrigger>
      </View>
      
      <DropdownMenuContent
        items={items}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        onClose={handleClose}
        width={width}
        position={dropdownPosition}
        visible={isOpen}
      />
    </View>
  );
}