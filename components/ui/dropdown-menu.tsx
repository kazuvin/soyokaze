import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, FlatList, type ViewProps } from 'react-native';
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
  placeholder?: string;
  disabled?: boolean;
  width?: number;
  maxHeight?: number;
};

export function DropdownMenu({
  items,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  width,
  maxHeight = 200,
  style,
  ...rest
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0, width: 0 });
  const triggerRef = useRef<TouchableOpacity>(null);
  const { theme } = useTheme();

  const selectedItem = items.find(item => item.value === selectedValue);
  const screenHeight = Dimensions.get('window').height;

  const handleOpen = () => {
    if (disabled) return;
    
    triggerRef.current?.measure((fx, fy, width, height, px, py) => {
      const dropdownHeight = Math.min(items.length * 48, maxHeight);
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

  const handleItemPress = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    onValueChange?.(item.value);
    handleClose();
  };

  const renderItem = ({ item }: { item: DropdownMenuItem }) => (
    <TouchableOpacity
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
    <View style={[{ position: 'relative' }, style]} {...rest}>
      <TouchableOpacity
        ref={triggerRef}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing[4],
            paddingVertical: Spacing[3],
            minHeight: 48,
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: theme.border.primary,
          },
          width && { width },
          disabled && { opacity: 0.6 },
        ]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {selectedItem?.icon && (
            <IconSymbol
              name={selectedItem.icon}
              size={20}
              color={theme.text.primary}
              style={{ marginRight: Spacing[3] }}
            />
          )}
          <ThemedText style={{ flex: 1 }}>
            {selectedItem?.label || placeholder}
          </ThemedText>
        </View>
        <IconSymbol
          name={isOpen ? "chevron.up" : "chevron.down"}
          size={16}
          color={theme.text.secondary}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View
            style={{
              position: 'absolute',
              left: dropdownPosition.x,
              top: dropdownPosition.y,
              width: dropdownPosition.width,
              maxHeight: maxHeight,
              backgroundColor: theme.background.elevated,
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: theme.border.primary,
              ...Shadow.lg,
            }}
          >
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: maxHeight }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}