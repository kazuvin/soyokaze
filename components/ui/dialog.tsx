import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  type ViewProps,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing, BorderRadius, Shadow, Opacity } from "@/constants/design-tokens";

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

  const handleBackdropPress = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${Opacity[50]})`,
            alignItems: "center",
            justifyContent: "center",
            padding: Spacing[4],
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                {
                  backgroundColor: theme.background.elevated,
                  borderRadius: BorderRadius.xl,
                  padding: Spacing[6],
                  minWidth: 280,
                  maxWidth: "90%",
                  ...Shadow.lg,
                },
                style,
              ]}
              {...rest}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function DialogHeader({
  children,
  style,
  ...rest
}: DialogHeaderProps) {
  return (
    <View
      style={[
        {
          marginBottom: Spacing[4],
        },
        style,
      ]}
      {...rest}
    >
      {children}
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
      <ThemedText type="h6" style={{ marginBottom: Spacing[2] }}>
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
        position: "absolute",
        top: Spacing[4],
        right: Spacing[4],
        padding: Spacing[2],
      }}
    >
      <IconSymbol name="xmark" size={20} />
    </TouchableOpacity>
  );
}