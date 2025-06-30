import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';

type KeyboardToolbarProps = {
  onImagePress: () => void;
  onBoldPress?: () => void;
  onItalicPress?: () => void;
  disabled?: boolean;
};

export function KeyboardToolbar({ 
  onImagePress, 
  onBoldPress, 
  onItalicPress, 
  disabled = false 
}: KeyboardToolbarProps) {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.background.elevated,
        borderTopColor: theme.border.subtle,
      }
    ]}>
      <TouchableOpacity
        style={[
          styles.toolButton,
          { backgroundColor: theme.background.default }
        ]}
        onPress={onImagePress}
        disabled={disabled}
      >
        <Ionicons
          name="image-outline"
          size={20}
          color={disabled ? theme.text.disabled : theme.text.primary}
        />
      </TouchableOpacity>
      
      {onBoldPress && (
        <TouchableOpacity
          style={[
            styles.toolButton,
            { backgroundColor: theme.background.default }
          ]}
          onPress={onBoldPress}
          disabled={disabled}
        >
          <Ionicons
            name="text-outline"
            size={20}
            color={disabled ? theme.text.disabled : theme.text.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderTopWidth: 1,
    gap: Spacing[2],
    minHeight: 44,
    alignItems: 'center',
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});