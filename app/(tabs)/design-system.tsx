import { StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ColorPalette } from '@/constants/design-tokens';

export default function DesignSystemScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f0f9ff', dark: '#082f49' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#0ea5e9"
          name="paintbrush.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Design System</ThemedText>
      </ThemedView>
      <ThemedText>
        This page showcases all design tokens and components in the design system.
      </ThemedText>

      {/* Color Palette Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Color Palette</ThemedText>
        <ColorShowcase />
      </ThemedView>

      {/* Typography Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Typography</ThemedText>
        <TypographyShowcase />
      </ThemedView>

      {/* Components Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Components</ThemedText>
        <ComponentShowcase />
      </ThemedView>

      {/* Spacing Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Spacing & Layout</ThemedText>
        <SpacingShowcase />
      </ThemedView>
    </ParallaxScrollView>
  );
}

function ColorShowcase() {
  const colorCategories = [
    { name: 'Primary', colors: ColorPalette.primary },
    { name: 'Secondary', colors: ColorPalette.secondary },
    { name: 'Accent', colors: ColorPalette.accent },
    { name: 'Success', colors: ColorPalette.success },
    { name: 'Warning', colors: ColorPalette.warning },
    { name: 'Error', colors: ColorPalette.error },
    { name: 'Neutral', colors: ColorPalette.neutral },
  ];

  return (
    <ThemedView>
      {colorCategories.map((category) => (
        <Collapsible key={category.name} title={category.name}>
          <View style={styles.colorGrid}>
            {Object.entries(category.colors).map(([shade, color]) => (
              <View key={shade} style={styles.colorItem}>
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color as string }
                  ]}
                />
                <ThemedText type="caption">{shade}</ThemedText>
                <ThemedText type="caption" style={styles.colorValue}>
                  {color as string}
                </ThemedText>
              </View>
            ))}
          </View>
        </Collapsible>
      ))}
    </ThemedView>
  );
}

function TypographyShowcase() {
  const typographyExamples = [
    { type: 'h1', text: 'Heading 1' },
    { type: 'h2', text: 'Heading 2' },
    { type: 'h3', text: 'Heading 3' },
    { type: 'h4', text: 'Heading 4' },
    { type: 'h5', text: 'Heading 5' },
    { type: 'h6', text: 'Heading 6' },
    { type: 'bodyLarge', text: 'Body Large - Lorem ipsum dolor sit amet' },
    { type: 'body', text: 'Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
    { type: 'bodySmall', text: 'Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { type: 'label', text: 'Label Text' },
    { type: 'caption', text: 'Caption Text' },
    { type: 'link', text: 'Link Text' },
    { type: 'code', text: 'const code = "example";' },
  ] as const;

  return (
    <ThemedView>
      {typographyExamples.map((example, index) => (
        <View key={index} style={styles.typographyItem}>
          <ThemedText type={example.type}>{example.text}</ThemedText>
          <ThemedText type="caption" style={styles.typographyLabel}>
            {example.type}
          </ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

function ComponentShowcase() {
  return (
    <ThemedView>
      <Collapsible title="Buttons">
        <ButtonShowcase />
      </Collapsible>
      <Collapsible title="Cards">
        <CardShowcase />
      </Collapsible>
    </ThemedView>
  );
}

function ButtonShowcase() {
  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Variants</ThemedText>
      <View style={styles.buttonRow}>
        <Button title="Primary" variant="primary" onPress={() => {}} />
        <Button title="Secondary" variant="secondary" onPress={() => {}} />
        <Button title="Outline" variant="outline" onPress={() => {}} />
        <Button title="Ghost" variant="ghost" onPress={() => {}} />
      </View>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Sizes</ThemedText>
      <View style={styles.buttonRow}>
        <Button title="Small" size="small" onPress={() => {}} />
        <Button title="Medium" size="medium" onPress={() => {}} />
        <Button title="Large" size="large" onPress={() => {}} />
      </View>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>States</ThemedText>
      <View style={styles.buttonRow}>
        <Button title="Normal" onPress={() => {}} />
        <Button title="Loading" loading onPress={() => {}} />
        <Button title="Disabled" disabled onPress={() => {}} />
      </View>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Full Width</ThemedText>
      <Button title="Full Width Button" fullWidth onPress={() => {}} />
    </ThemedView>
  );
}

function CardShowcase() {
  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Variants</ThemedText>
      <View style={styles.cardGrid}>
        <Card variant="elevated" style={styles.cardExample}>
          <ThemedText type="h6">Elevated Card</ThemedText>
          <ThemedText type="body">Card with shadow elevation</ThemedText>
        </Card>
        
        <Card variant="flat" style={styles.cardExample}>
          <ThemedText type="h6">Flat Card</ThemedText>
          <ThemedText type="body">Card with background color</ThemedText>
        </Card>
        
        <Card variant="outlined" style={styles.cardExample}>
          <ThemedText type="h6">Outlined Card</ThemedText>
          <ThemedText type="body">Card with border outline</ThemedText>
        </Card>
      </View>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Padding Options</ThemedText>
      <View style={styles.cardGrid}>
        <Card padding="small" style={styles.cardExample}>
          <ThemedText type="caption">Small Padding</ThemedText>
        </Card>
        
        <Card padding="medium" style={styles.cardExample}>
          <ThemedText type="caption">Medium Padding</ThemedText>
        </Card>
        
        <Card padding="large" style={styles.cardExample}>
          <ThemedText type="caption">Large Padding</ThemedText>
        </Card>
        
        <Card padding="none" style={[styles.cardExample, { padding: 8 }]}>
          <ThemedText type="caption">No Padding</ThemedText>
        </Card>
      </View>
    </ThemedView>
  );
}

function SpacingShowcase() {
  const spacingSizes = [
    { name: 'xs', value: 2 },
    { name: 'sm', value: 4 },
    { name: 'md', value: 8 },
    { name: 'lg', value: 16 },
    { name: 'xl', value: 24 },
    { name: '2xl', value: 32 },
    { name: '3xl', value: 48 },
  ];

  return (
    <ThemedView>
      {spacingSizes.map((spacing) => (
        <View key={spacing.name} style={styles.spacingItem}>
          <View style={[styles.spacingBox, { width: spacing.value, height: spacing.value }]} />
          <ThemedText type="body">{spacing.name}: {spacing.value}px</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#0ea5e9',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginTop: 32,
    gap: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  colorValue: {
    fontSize: 10,
    opacity: 0.7,
  },
  typographyItem: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  typographyLabel: {
    marginTop: 4,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  componentSection: {
    padding: 16,
    marginTop: 8,
  },
  spacingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  spacingBox: {
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  cardGrid: {
    gap: 12,
    marginTop: 8,
  },
  cardExample: {
    marginBottom: 8,
  },
});