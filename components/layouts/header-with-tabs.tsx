import React from 'react';
import {
  StyleSheet,
  type ViewProps,
} from 'react-native';
import { type SharedValue } from 'react-native-reanimated';

import { Header } from './header';
import { Tabs, TabsList, TabsTrigger, type TabsProps } from '@/components/ui/tabs';
import { Spacing } from '@/constants/design-tokens';

type HeaderWithTabsProps = ViewProps & {
  title?: string;
  enableBlur?: boolean;
  scrollY?: SharedValue<number>;
  blurIntensity?: number;
  showShadow?: boolean;
  height?: number;
  tabsProps: Omit<TabsProps, 'children'>;
  tabs: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  children?: React.ReactNode;
};

export function HeaderWithTabs({
  title,
  enableBlur = false,
  scrollY,
  blurIntensity = 50,
  showShadow = true,
  height = 120,
  tabsProps,
  tabs,
  children,
  style,
  ...rest
}: HeaderWithTabsProps) {
  return (
    <Header
      title={title}
      enableBlur={enableBlur}
      scrollY={scrollY}
      blurIntensity={blurIntensity}
      showShadow={showShadow}
      height={height}
      style={[styles.container, style]}
      {...rest}
    >
      <Tabs {...tabsProps}>
        <TabsList
          style={styles.tabsList}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </Header>
  );
}

const styles = StyleSheet.create({
  container: {
    // Additional spacing for tabs
  },
  tabsList: {
    marginTop: Spacing[2],
    paddingHorizontal: 0,
  },
  tabsContent: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
  },
});