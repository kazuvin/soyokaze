import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { TextInput } from '@/components/ui/text-input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ColorPalette, Shadow, BorderRadius } from '@/constants/design-tokens';
import { useTheme } from '@/hooks/use-theme';

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

      {/* Border Radius Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Border Radius</ThemedText>
        <BorderRadiusShowcase />
      </ThemedView>

      {/* Shadow Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Shadows</ThemedText>
        <ShadowShowcase />
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
      <Collapsible title="Dialogs">
        <DialogShowcase />
      </Collapsible>
      <Collapsible title="Text Inputs">
        <TextInputShowcase />
      </Collapsible>
      <Collapsible title="Accordions">
        <AccordionShowcase />
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
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>With Icons</ThemedText>
      <View style={styles.buttonRow}>
        <Button title="Search" icon="magnifyingglass" onPress={() => {}} />
        <Button title="Save" icon="heart" variant="secondary" onPress={() => {}} />
        <Button title="Delete" icon="trash" variant="outline" onPress={() => {}} />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Icon Only</ThemedText>
      <View style={styles.buttonRow}>
        <Button icon="plus" iconOnly size="small" onPress={() => {}} />
        <Button icon="gear" iconOnly size="medium" onPress={() => {}} />
        <Button icon="star" iconOnly size="large" onPress={() => {}} />
        <Button icon="heart" iconOnly variant="outline" onPress={() => {}} />
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
          <CardHeader>
            <CardTitle>Elevated Card</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemedText type="body">Card with shadow elevation</ThemedText>
          </CardContent>
        </Card>
        
        <Card variant="flat" style={styles.cardExample}>
          <CardHeader>
            <CardTitle>Flat Card</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemedText type="body">Card with background color</ThemedText>
          </CardContent>
        </Card>
        
        <Card variant="outlined" style={styles.cardExample}>
          <CardHeader>
            <CardTitle>Outlined Card</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemedText type="body">Card with border outline</ThemedText>
          </CardContent>
        </Card>
      </View>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Structured Card Example</ThemedText>
      <Card variant="elevated" style={styles.cardExample}>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemedText type="body">This is an example of a structured card using the new Card components.</ThemedText>
          <ThemedText type="caption" style={{ marginTop: 8 }}>Created with CardHeader, CardTitle, and CardContent</ThemedText>
        </CardContent>
      </Card>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Header Only Card</ThemedText>
      <Card variant="outlined" style={styles.cardExample}>
        <CardHeader>
          <CardTitle>Simple Header Card</CardTitle>
        </CardHeader>
      </Card>
      
      <ThemedText type="h6" style={{ marginTop: 16 }}>Content Only Card</ThemedText>
      <Card variant="flat" style={styles.cardExample}>
        <CardContent>
          <ThemedText type="body">This card only has content without a header.</ThemedText>
        </CardContent>
      </Card>
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

function BorderRadiusShowcase() {
  const { theme } = useTheme();
  const borderRadiusLevels = [
    { name: 'none', value: BorderRadius.none, description: 'No border radius' },
    { name: 'sm', value: BorderRadius.sm, description: 'Small border radius' },
    { name: 'base', value: BorderRadius.base, description: 'Base border radius' },
    { name: 'md', value: BorderRadius.md, description: 'Medium border radius' },
    { name: 'lg', value: BorderRadius.lg, description: 'Large border radius' },
    { name: 'xl', value: BorderRadius.xl, description: 'Extra large border radius' },
    { name: '2xl', value: BorderRadius['2xl'], description: '2xl border radius' },
    { name: '3xl', value: BorderRadius['3xl'], description: '3xl border radius' },
    { name: 'full', value: BorderRadius.full, description: 'Full border radius (circular)' },
  ];

  return (
    <ThemedView>
      {borderRadiusLevels.map((level) => (
        <View key={level.name} style={styles.borderRadiusItem}>
          <View
            style={[
              styles.borderRadiusBox,
              {
                backgroundColor: theme.background.elevated,
                borderRadius: level.value,
                borderWidth: 1,
                borderColor: theme.border.default,
              }
            ]}
          >
            <ThemedText type="h6">{level.name}</ThemedText>
            <ThemedText type="caption" style={styles.borderRadiusDescription}>
              {level.description}
            </ThemedText>
            <ThemedText type="caption" style={styles.borderRadiusValue}>
              {level.value}px
            </ThemedText>
          </View>
        </View>
      ))}
    </ThemedView>
  );
}

function ShadowShowcase() {
  const { theme } = useTheme();
  const shadowLevels = [
    { name: 'sm', shadow: Shadow.sm, description: 'Subtle shadow for small elements' },
    { name: 'base', shadow: Shadow.base, description: 'Default shadow for cards' },
    { name: 'md', shadow: Shadow.md, description: 'Medium shadow for elevated content' },
    { name: 'lg', shadow: Shadow.lg, description: 'Large shadow for modals' },
    { name: 'xl', shadow: Shadow.xl, description: 'Extra large shadow for overlays' },
    { name: '2xl', shadow: Shadow['2xl'], description: 'Maximum shadow for dropdowns' },
  ];

  return (
    <ThemedView>
      {shadowLevels.map((level) => (
        <View key={level.name} style={styles.shadowItem}>
          <View
            style={[
              styles.shadowBox,
              {
                backgroundColor: theme.background.elevated,
                ...level.shadow,
              }
            ]}
          >
            <ThemedText type="h6">{level.name}</ThemedText>
            <ThemedText type="caption" style={styles.shadowDescription}>
              {level.description}
            </ThemedText>
            <ThemedText type="caption" style={styles.shadowValues}>
              offset: {level.shadow.shadowOffset.width}, {level.shadow.shadowOffset.height} |{' '}
              opacity: {level.shadow.shadowOpacity} |{' '}
              radius: {level.shadow.shadowRadius} |{' '}
              elevation: {level.shadow.elevation}
            </ThemedText>
          </View>
        </View>
      ))}
    </ThemedView>
  );
}

function DialogShowcase() {
  const [basicDialogOpen, setBasicDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Basic Dialog</ThemedText>
      <Dialog open={basicDialogOpen} onOpenChange={setBasicDialogOpen}>
        <DialogTrigger>
          <Button 
            title="Open Basic Dialog" 
            onPress={() => setBasicDialogOpen(true)} 
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Basic Dialog</DialogTitle>
            <DialogDescription>
              This is a basic dialog example with a title and description.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button title="Close" variant="outline" />
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Confirmation Dialog</ThemedText>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogTrigger>
          <Button 
            title="Delete Item" 
            variant="outline"
            onPress={() => setConfirmDialogOpen(true)} 
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button title="Cancel" variant="outline" />
            </DialogClose>
            <DialogClose onPress={() => console.log('Item deleted')}>
              <Button title="Delete" variant="primary" />
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Custom Dialog</ThemedText>
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogTrigger>
          <Button 
            title="Open Custom Dialog" 
            variant="secondary"
            onPress={() => setCustomDialogOpen(true)} 
          />
        </DialogTrigger>
        <DialogContent>
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Custom Dialog with Close Button</DialogTitle>
            <DialogDescription>
              This dialog has a close button in the header and demonstrates custom styling.
            </DialogDescription>
          </DialogHeader>
          <View style={{ paddingVertical: 16 }}>
            <ThemedText type="body">
              You can add any custom content here. The dialog will automatically handle backdrop clicks and the close button.
            </ThemedText>
          </View>
          <DialogFooter>
            <DialogClose>
              <Button title="Got it" variant="primary" />
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemedView>
  );
}

function TextInputShowcase() {
  const [baseValue, setBaseValue] = useState('');
  const [borderlessValue, setBorderlessValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Variants</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <TextInput
          placeholder="Base variant"
          variant="base"
          value={baseValue}
          onChangeText={setBaseValue}
        />
        <TextInput
          placeholder="Borderless variant"
          variant="borderless"
          value={borderlessValue}
          onChangeText={setBorderlessValue}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Sizes</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <TextInput
          placeholder="Small size"
          size="small"
        />
        <TextInput
          placeholder="Medium size (default)"
          size="medium"
        />
        <TextInput
          placeholder="Large size"
          size="large"
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>With Labels</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <TextInput
          label="Name"
          placeholder="Enter your name"
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          variant="borderless"
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Error State</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <TextInput
          label="Password"
          placeholder="Enter password"
          value={errorValue}
          onChangeText={setErrorValue}
          error="Password must be at least 8 characters"
          secureTextEntry
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>With Icons</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <TextInput
          placeholder="Search..."
          leadingIcon="magnifyingglass"
        />
        <TextInput
          placeholder="Password"
          trailingIcon="eye"
          onTrailingIconPress={() => console.log('Toggle password visibility')}
          secureTextEntry
        />
        <TextInput
          placeholder="Clear input"
          leadingIcon="person"
          trailingIcon="xmark.circle.fill"
          onTrailingIconPress={() => setBorderlessValue('')}
          value={borderlessValue}
          onChangeText={setBorderlessValue}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Full Width</ThemedText>
      <TextInput
        placeholder="Full width input"
        fullWidth
      />
    </ThemedView>
  );
}

function AccordionShowcase() {
  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Single Accordion</ThemedText>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern and follows accessibility best practices.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with built-in styles that match the design system theme.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. The accordion includes smooth animations for expand and collapse transitions.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ThemedText type="h6" style={{ marginTop: 24 }}>Multiple Accordion</ThemedText>
      <Accordion type="multiple" defaultValue={["multiple-1", "multiple-2"]}>
        <AccordionItem value="multiple-1">
          <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
          <AccordionContent>
            Yes. With type=&quot;multiple&quot;, you can open multiple accordion items at the same time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="multiple-2">
          <AccordionTrigger>Does it work with React Native?</AccordionTrigger>
          <AccordionContent>
            Yes. This accordion component is built specifically for React Native and works seamlessly with Expo.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="multiple-3">
          <AccordionTrigger>Is it customizable?</AccordionTrigger>
          <AccordionContent>
            Absolutely. You can customize styling, animations, and behavior to match your app&apos;s needs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ThemedText type="h6" style={{ marginTop: 24 }}>With Custom Content</ThemedText>
      <Accordion type="single" collapsible>
        <AccordionItem value="custom-1">
          <AccordionTrigger>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconSymbol name="questionmark.circle" size={16} />
              <ThemedText type="bodyMedium" style={{ fontWeight: '500' }}>
                Custom Trigger Content
              </ThemedText>
            </View>
          </AccordionTrigger>
          <AccordionContent>
            <View style={{ gap: 12 }}>
              <ThemedText type="body">
                You can add custom content to both the trigger and content areas.
              </ThemedText>
              <Button 
                title="Action Button" 
                size="small" 
                variant="outline"
                onPress={() => console.log('Button pressed in accordion')}
              />
            </View>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="custom-2" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>
            This content won&apos;t be shown because the item is disabled.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
  shadowItem: {
    marginBottom: 20,
  },
  shadowBox: {
    padding: 16,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  shadowDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
  shadowValues: {
    marginTop: 4,
    opacity: 0.5,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  borderRadiusItem: {
    marginBottom: 16,
  },
  borderRadiusBox: {
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRadiusDescription: {
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'center',
  },
  borderRadiusValue: {
    marginTop: 4,
    opacity: 0.5,
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});