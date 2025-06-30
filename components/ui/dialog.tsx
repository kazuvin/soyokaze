import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  type ViewProps,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing, BorderRadius } from "@/constants/design-tokens";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export type DialogContentProps = ViewProps & {
  children: React.ReactNode;
};

export type DialogHeaderProps = ViewProps & {
  children: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export type DialogTitleProps = ViewProps & {
  children: React.ReactNode;
};

export type DialogDescriptionProps = ViewProps & {
  children: React.ReactNode;
};

export type DialogFooterProps = ViewProps & {
  children: React.ReactNode;
};

export type DialogCloseProps = {
  onPress?: () => void;
  children?: React.ReactNode;
};

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogContent({
  children,
  style,
  ...rest
}: DialogContentProps) {
  const { theme } = useTheme();
  const { open, onOpenChange } = React.useContext(DialogContext);

  // Extract header and content children
  const childrenArray = React.Children.toArray(children);
  const headerElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === DialogHeader
  );
  const otherChildren = childrenArray.filter(
    (child) => !(React.isValidElement(child) && child.type === DialogHeader)
  );

  return (
    <Modal
      visible={open}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => onOpenChange(false)}
    >
      <View
        style={[
          {
            flex: 1,
            backgroundColor: theme.background.default,
          },
          style,
        ]}
        {...rest}
      >
        {/* Fixed Header */}
        {headerElement}
        
        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: Spacing[4],
            paddingBottom: Spacing[6],
          }}
          showsVerticalScrollIndicator={false}
        >
          {otherChildren}
        </ScrollView>
      </View>
    </Modal>
  );
}

export function DialogHeader({
  children,
  leftElement,
  rightElement,
  style,
  ...rest
}: DialogHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <View
      style={[
        {
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 0,
          paddingTop: Spacing[4],
          paddingBottom: Spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: theme.border.primary,
          backgroundColor: theme.background.default,
        },
        style,
      ]}
      {...rest}
    >
      {/* Left Element - Absolute Position */}
      {leftElement && (
        <View style={{ 
          position: "absolute", 
          left: Spacing[6], 
          top: Spacing[4],
          bottom: Spacing[3],
          justifyContent: "center"
        }}>
          {leftElement}
        </View>
      )}
      
      {/* Center Content - Flex Center */}
      <View style={{ alignItems: "center" }}>
        {children}
      </View>
      
      {/* Right Element - Absolute Position */}
      <View style={{ 
        position: "absolute", 
        right: Spacing[6], 
        top: Spacing[4],
        bottom: Spacing[3],
        justifyContent: "center"
      }}>
        {rightElement || <DialogClose />}
      </View>
    </View>
  );
}

export function DialogTitle({
  children,
  style,
  ...rest
}: DialogTitleProps) {
  return (
    <View style={[style]} {...rest}>
      <ThemedText 
        type="h6" 
        style={{ 
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {children}
      </ThemedText>
    </View>
  );
}

export function DialogDescription({
  children,
  style,
  ...rest
}: DialogDescriptionProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[style]} {...rest}>
      <ThemedText 
        type="default" 
        style={{ 
          color: theme.text.secondary,
          lineHeight: 20,
        }}
      >
        {children}
      </ThemedText>
    </View>
  );
}

export function DialogFooter({
  children,
  style,
  ...rest
}: DialogFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: Spacing[3],
          marginTop: Spacing[6],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function DialogClose({ onPress, children }: DialogCloseProps) {
  const { onOpenChange } = React.useContext(DialogContext);
  const { theme } = useTheme();
  
  const handlePress = () => {
    onOpenChange(false);
    onPress?.();
  };

  if (children) {
    return (
      <Pressable onPress={handlePress}>
        {children}
      </Pressable>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        padding: Spacing[2],
        borderRadius: BorderRadius.md,
      }}
    >
      <IconSymbol 
        name="xmark" 
        size={18} 
        color={theme.text.secondary}
      />
    </TouchableOpacity>
  );
}