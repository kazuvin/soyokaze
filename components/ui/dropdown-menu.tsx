import React, { useState, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Spacing, BorderRadius, Shadow } from '@/constants/design-tokens';

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<View>;
};

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
}

export type DropdownMenuProps = ViewProps & {
  children: React.ReactNode;
};

export type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
};

export type DropdownMenuContentProps = ViewProps & {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  alignOffset?: number;
};

export type DropdownMenuItemProps = ViewProps & {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
};

export type DropdownMenuLabelProps = ViewProps & {
  children: React.ReactNode;
};

export type DropdownMenuSeparatorProps = ViewProps;

export function DropdownMenu({ children, style, ...rest }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<View>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <View style={[{ position: 'relative' }, style]} {...rest}>
        {children}
      </View>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
  const { setOpen, triggerRef } = useDropdownMenu();

  const handlePress = () => {
    setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onPress: handlePress,
    });
  }

  return (
    <View ref={triggerRef}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

export function DropdownMenuContent({
  children,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  style,
  ...rest
}: DropdownMenuContentProps) {
  const { open, setOpen, triggerRef } = useDropdownMenu();
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
  const { theme } = useTheme();

  React.useEffect(() => {
    if (open && triggerRef.current) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        let x = px;
        let y = py;

        // Calculate position based on side
        switch (side) {
          case 'bottom':
            y = py + height + sideOffset;
            break;
          case 'top':
            y = py - sideOffset;
            break;
          case 'left':
            x = px - sideOffset;
            break;
          case 'right':
            x = px + width + sideOffset;
            break;
        }

        // Calculate alignment
        switch (align) {
          case 'center':
            if (side === 'top' || side === 'bottom') {
              x = px + (width / 2) + alignOffset;
            } else {
              y = py + (height / 2) + alignOffset;
            }
            break;
          case 'end':
            if (side === 'top' || side === 'bottom') {
              x = px + width + alignOffset;
            } else {
              y = py + height + alignOffset;
            }
            break;
          case 'start':
          default:
            if (side === 'top' || side === 'bottom') {
              x = px + alignOffset;
            } else {
              y = py + alignOffset;
            }
            break;
        }

        setPosition({ x, y, width });
      });
    }
  }, [open, side, align, sideOffset, alignOffset, triggerRef]);

  if (!open) return null;

  return (
    <>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      />
      <View
        style={[
          {
            position: 'absolute',
            left: position.x,
            top: position.y,
            minWidth: 180,
            backgroundColor: theme.background.elevated,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: theme.border.primary,
            paddingVertical: Spacing[1],
            zIndex: 1001,
            ...Shadow.lg,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  style,
  ...rest
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing[3],
          paddingVertical: Spacing[2],
          minHeight: 36,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

export function DropdownMenuLabel({ children, style, ...rest }: DropdownMenuLabelProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: Spacing[3],
          paddingVertical: Spacing[2],
        },
        style,
      ]}
      {...rest}
    >
      <ThemedText type="caption" style={{ opacity: 0.7 }}>
        {children}
      </ThemedText>
    </View>
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
        },
        style,
      ]}
      {...rest}
    />
  );
}