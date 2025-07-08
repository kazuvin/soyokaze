import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Platform,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { ColorPalette, Spacing, BorderRadius, Shadow } from "@/constants/design-tokens";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { SymbolName } from "@/components/ui/icon-symbol";

export type DropdownMenuItem = {
  id: string;
  label: string;
  icon?: SymbolName;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
};

export type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  style?: ViewStyle;
  onOpenChange?: (open: boolean) => void;
};

export function DropdownMenu({
  trigger,
  items,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  style,
  onOpenChange,
}: DropdownMenuProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const triggerRef = useRef<View>(null);

  const handleOpen = () => {
    triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setTriggerLayout({ x: pageX, y: pageY, width, height });
      setIsOpen(true);
      onOpenChange?.(true);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const getMenuPosition = () => {
    if (!triggerLayout) return { top: 0, left: 0 };

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const menuWidth = 200; // 推定メニュー幅
    const menuHeight = items.length * 44 + Spacing[2] * 2; // 推定メニュー高さ

    let top = 0;
    let left = 0;

    // 縦方向の位置計算
    switch (side) {
      case "top":
        top = triggerLayout.y - menuHeight - sideOffset;
        break;
      case "bottom":
        top = triggerLayout.y + triggerLayout.height + sideOffset;
        break;
      case "left":
        top = triggerLayout.y + alignOffset;
        break;
      case "right":
        top = triggerLayout.y + alignOffset;
        break;
    }

    // 横方向の位置計算
    switch (side) {
      case "top":
      case "bottom":
        switch (align) {
          case "start":
            left = triggerLayout.x + alignOffset;
            break;
          case "center":
            left = triggerLayout.x + triggerLayout.width / 2 - menuWidth / 2 + alignOffset;
            break;
          case "end":
            left = triggerLayout.x + triggerLayout.width - menuWidth + alignOffset;
            break;
        }
        break;
      case "left":
        left = triggerLayout.x - menuWidth - sideOffset;
        break;
      case "right":
        left = triggerLayout.x + triggerLayout.width + sideOffset;
        break;
    }

    // 画面外に出ないように調整
    left = Math.max(Spacing[2], Math.min(left, screenWidth - menuWidth - Spacing[2]));
    top = Math.max(Spacing[2], Math.min(top, screenHeight - menuHeight - Spacing[2]));

    return { top, left };
  };

  const renderMenuItem = (item: DropdownMenuItem, index: number) => {
    if (item.separator) {
      return (
        <View
          key={`separator-${index}`}
          style={{
            height: 1,
            backgroundColor: theme.border.secondary,
            marginVertical: Spacing[1],
          }}
        />
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: Spacing[3],
          paddingHorizontal: Spacing[4],
          minHeight: 44,
          opacity: item.disabled ? 0.5 : 1,
        }}
        disabled={item.disabled}
        onPress={() => {
          if (!item.disabled) {
            item.onPress?.();
            handleClose();
          }
        }}
      >
        {item.icon && (
          <IconSymbol
            name={item.icon}
            size={16}
            color={
              item.destructive
                ? ColorPalette.error[500]
                : theme.text.primary
            }
            style={{ marginRight: Spacing[3] }}
          />
        )}
        <ThemedText
          style={{
            flex: 1,
            fontSize: 16,
            color: item.destructive
              ? ColorPalette.error[500]
              : theme.text.primary,
          }}
        >
          {item.label}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        ref={triggerRef}
        style={style}
      >
        {React.cloneElement(trigger as React.ReactElement, {
          onPress: handleOpen,
        })}
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          style={{
            flex: 1,
          }}
          onPress={handleClose}
        >
          <View
            style={[
              {
                position: "absolute",
                minWidth: 180,
                backgroundColor: theme.background.primary,
                borderRadius: BorderRadius.lg,
                borderWidth: 1,
                borderColor: theme.border.secondary,
                paddingVertical: Spacing[1],
                ...Platform.select({
                  ios: {
                    ...Shadow.md,
                    shadowColor: theme.shadow.color,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              },
              getMenuPosition(),
            ]}
          >
            {items.map((item, index) => renderMenuItem(item, index))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default DropdownMenu;