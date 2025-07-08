import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions, type ViewProps } from "react-native";
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

type Position = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const DropdownMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<TouchableOpacity>;
  contentPosition: Position | null;
  setContentPosition: (position: Position | null) => void;
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
  const [contentPosition, setContentPosition] = useState<Position | null>(null);
  const triggerRef = useRef<TouchableOpacity>(null);

  const open = controlledOpen ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        triggerRef,
        contentPosition,
        setContentPosition,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, onPress, disabled, ...rest }: DropdownMenuTriggerProps) {
  const { open, onOpenChange, triggerRef, setContentPosition } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    
    if (!open) {
      // Calculate position when opening
      triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setContentPosition({
          top: pageY,
          left: pageX,
          width,
          height,
        });
      });
    }
    
    onPress?.();
    onOpenChange(!open);
  };

  return (
    <TouchableOpacity
      ref={triggerRef}
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
  const { open, contentPosition } = useDropdownMenu();
  const [adjustedPosition, setAdjustedPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open || !contentPosition) {
      setAdjustedPosition(null);
      return;
    }

    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
    const { top, left, width, height } = contentPosition;

    let finalTop = top;
    let finalLeft = left;

    // Calculate position based on side
    switch (side) {
      case "bottom":
        finalTop = top + height + sideOffset;
        break;
      case "top":
        finalTop = top - maxHeight - sideOffset;
        break;
      case "right":
        finalLeft = left + width + sideOffset;
        break;
      case "left":
        finalLeft = left - 200 - sideOffset; // Assuming 200px width
        break;
    }

    // Calculate alignment
    switch (align) {
      case "start":
        // Already set
        break;
      case "center":
        if (side === "bottom" || side === "top") {
          finalLeft = left + (width / 2) - 100; // Assuming 200px width
        } else {
          finalTop = top + (height / 2) - (maxHeight / 2);
        }
        break;
      case "end":
        if (side === "bottom" || side === "top") {
          finalLeft = left + width - 200; // Assuming 200px width
        } else {
          finalTop = top + height - maxHeight;
        }
        break;
    }

    // Apply alignment offset
    if (side === "bottom" || side === "top") {
      finalLeft += alignOffset;
    } else {
      finalTop += alignOffset;
    }

    // Ensure content stays within screen bounds
    const contentWidth = 200; // Fixed width for simplicity
    const contentHeight = Math.min(maxHeight, 200);

    if (finalLeft + contentWidth > screenWidth) {
      finalLeft = screenWidth - contentWidth - Spacing[2];
    }
    if (finalLeft < Spacing[2]) {
      finalLeft = Spacing[2];
    }
    if (finalTop + contentHeight > screenHeight) {
      finalTop = screenHeight - contentHeight - Spacing[2];
    }
    if (finalTop < Spacing[2]) {
      finalTop = Spacing[2];
    }

    setAdjustedPosition({ top: finalTop, left: finalLeft });
  }, [open, contentPosition, side, align, sideOffset, alignOffset, maxHeight]);

  if (!open || !adjustedPosition) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        top: adjustedPosition.top,
        left: adjustedPosition.left,
        width: 200,
        maxHeight,
        backgroundColor: theme.background.elevated,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: theme.border.primary,
        zIndex: ZIndex[50],
        ...Shadow.lg,
      }}
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

// Close dropdown when clicking outside
export function useDropdownMenuAutoClose() {
  const { open, onOpenChange } = useDropdownMenu();

  useEffect(() => {
    if (!open) return;

    // This is a simplified approach - in a real app you might want to use
    // a more sophisticated outside click detection
    const timer = setTimeout(() => {
      // Auto-close after some time if needed
      onOpenChange(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [open, onOpenChange]);
}