import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing, BorderRadius, Shadow, ColorPalette, ZIndex } from "@/constants/design-tokens";
import type { SymbolName } from "@/components/ui/icon-symbol";

export type DropdownMenuTriggerProps = ViewProps & {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export type DropdownMenuItemProps = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  icon?: SymbolName;
  destructive?: boolean;
};

export type DropdownMenuSeparatorProps = ViewProps;

export type DropdownMenuContentProps = ViewProps & {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  alignOffset?: number;
  maxHeight?: number;
};

export type DropdownMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
}

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
      }}
    >
      <View style={{ position: 'relative' }}>
        {children}
      </View>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, onPress, disabled, ...rest }: DropdownMenuTriggerProps) {
  const { open, onOpenChange } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    onOpenChange(!open);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

export function DropdownMenuContent({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  maxHeight = 200,
  style,
  ...rest
}: DropdownMenuContentProps) {
  const { theme } = useTheme();
  const { open } = useDropdownMenu();

  if (!open) {
    return null;
  }

  const contentWidth = 200;
  let topPosition = sideOffset;
  let leftPosition = 0;

  // Calculate alignment
  switch (align) {
    case "start":
      leftPosition = 0;
      break;
    case "center":
      leftPosition = -100; // Half of contentWidth
      break;
    case "end":
      leftPosition = -contentWidth;
      break;
  }
  leftPosition += alignOffset;

  return (
    <View
      style={[
        {
          position: "absolute",
          top: topPosition,
          left: leftPosition,
          width: contentWidth,
          maxHeight,
          backgroundColor: theme.background.elevated,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: theme.border.primary,
          zIndex: ZIndex[50],
          ...Shadow.lg,
        },
        style,
      ]}
      {...rest}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight }}
        contentContainerStyle={{
          paddingVertical: Spacing[1],
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function DropdownMenuItem({
  children,
  onPress,
  disabled,
  icon,
  destructive,
}: DropdownMenuItemProps) {
  const { theme } = useTheme();
  const { onOpenChange } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    onOpenChange(false);
  };

  const textColor = destructive
    ? ColorPalette.error[600]
    : disabled
    ? theme.text.tertiary
    : theme.text.primary;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing[3],
        paddingVertical: Spacing[2],
        marginHorizontal: Spacing[1],
        borderRadius: BorderRadius.sm,
        backgroundColor: "transparent",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && (
        <IconSymbol
          name={icon}
          size={16}
          color={textColor}
          style={{ marginRight: Spacing[2] }}
        />
      )}
      <ThemedText
        style={{
          color: textColor,
          fontSize: 14,
          flex: 1,
        }}
      >
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}

export function DropdownMenuSeparator({ style, ...rest }: DropdownMenuSeparatorProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.border.primary,
          marginVertical: Spacing[1],
          marginHorizontal: Spacing[1],
        },
        style,
      ]}
      {...rest}
    />
  );
}