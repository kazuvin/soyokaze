import React, { useState } from 'react';
import { StyleSheet, View, Animated, ScrollView } from 'react-native';

import { Collapsible } from '@/components/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAction, ListLabel } from '@/components/ui/list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TextInput } from '@/components/ui/text-input';
import { Textarea } from '@/components/ui/textarea';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ColorPalette, Shadow, BorderRadius, Spacing } from '@/constants/design-tokens';
import { useTheme } from '@/hooks/use-theme';
import { Header } from '@/components/layouts';

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

      {/* Header Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3">Header Layout</ThemedText>
        <HeaderShowcase />
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
      <Collapsible title="Lists">
        <ListShowcase />
      </Collapsible>
      <Collapsible title="Tabs">
        <TabsShowcase />
      </Collapsible>
      <Collapsible title="Text Inputs">
        <TextInputShowcase />
      </Collapsible>
      <Collapsible title="Textareas">
        <TextareaShowcase />
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
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);

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

      <ThemedText type="h6" style={{ marginTop: 16 }}>Slide Dialog</ThemedText>
      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen} variant="slide">
        <DialogTrigger>
          <Button 
            title="Open Slide Dialog" 
            variant="ghost"
            onPress={() => setSlideDialogOpen(true)} 
          />
        </DialogTrigger>
        <DialogContent>
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Slide Dialog</DialogTitle>
            <DialogDescription>
              This dialog slides up from the bottom of the screen like a modal.
            </DialogDescription>
          </DialogHeader>
          <View style={{ paddingVertical: 16 }}>
            <ThemedText type="body">
              This is a full-screen modal that slides in from the bottom. It&apos;s perfect for forms, settings, or detailed content.
            </ThemedText>
          </View>
          <DialogFooter>
            <DialogClose>
              <Button title="Close" variant="primary" />
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

function ListShowcase() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const navigationItems = [
    { id: '1', icon: 'house' as const, title: 'ホーム', description: 'メインダッシュボード' },
    { id: '2', icon: 'gear' as const, title: '設定', description: 'アプリの設定を変更' },
    { id: '3', icon: 'person' as const, title: 'プロフィール', description: 'アカウント情報' },
    { id: '4', icon: 'bell' as const, title: '通知', description: '通知設定を管理' },
    { id: '5', icon: 'questionmark.circle' as const, title: 'ヘルプ', description: 'よくある質問' },
  ];

  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Basic List</ThemedText>
      <List style={{ marginTop: 8 }}>
        <ListItem>
          <ListItemIcon name="house" />
          <ListItemText primary="ホーム" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="gear" />
          <ListItemText primary="設定" secondary="アプリの設定を変更" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="person" />
          <ListItemText primary="プロフィール" />
          <ListItemAction>
            <Button variant="ghost" size="small" title="編集" />
          </ListItemAction>
        </ListItem>
      </List>

      <ThemedText type="h6" style={{ marginTop: 24 }}>List Variants</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <List variant="default">
          <ListItem>
            <ListItemText primary="Default List" secondary="Standard appearance" />
          </ListItem>
        </List>
        
        <List variant="elevated">
          <ListItem>
            <ListItemText primary="Elevated List" secondary="With shadow effect" />
          </ListItem>
        </List>
        
        <List variant="outlined">
          <ListItem>
            <ListItemText primary="Outlined List" secondary="With border outline" />
          </ListItem>
        </List>
      </View>

      <ThemedText type="h6" style={{ marginTop: 24 }}>Interactive List with Navigation</ThemedText>
      <List variant="elevated" style={{ marginTop: 8 }}>
        {navigationItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem
              onPress={() => {
                setSelectedItem(item.id);
                console.log(`Selected: ${item.title}`);
              }}
            >
              <ListItemIcon name={item.icon} />
              <ListItemText 
                primary={item.title} 
                secondary={item.description} 
              />
              <ListItemAction>
                <IconSymbol 
                  name="chevron.right" 
                  size={16} 
                  color={selectedItem === item.id ? '#0ea5e9' : '#a1a1aa'} 
                />
              </ListItemAction>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <ThemedText type="h6" style={{ marginTop: 24 }}>List without Separators</ThemedText>
      <List variant="outlined" style={{ marginTop: 8 }}>
        <ListItem>
          <ListItemIcon name="star" />
          <ListItemText primary="Favorites" secondary="Your starred items" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="clock" />
          <ListItemText primary="Recent" secondary="Recently accessed" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="folder" />
          <ListItemText primary="Documents" secondary="File storage" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="trash" />
          <ListItemText primary="Trash" secondary="Deleted items" />
        </ListItem>
      </List>

      <ThemedText type="h6" style={{ marginTop: 24 }}>List with Actions</ThemedText>
      <List variant="default" style={{ marginTop: 8 }}>
        <ListItem>
          <ListItemIcon name="envelope" />
          <ListItemText 
            primary="Email Notifications" 
            secondary="Receive notifications via email" 
          />
          <ListItemAction>
            <Button 
              variant="outline" 
              size="small" 
              title="On" 
              onPress={() => console.log('Toggle email')} 
            />
          </ListItemAction>
        </ListItem>
        <ListItem>
          <ListItemIcon name="speaker.wave.2" />
          <ListItemText 
            primary="Sound Effects" 
            secondary="Play sounds for actions" 
          />
          <ListItemAction>
            <Button 
              variant="ghost" 
              size="small" 
              title="Off" 
              onPress={() => console.log('Toggle sound')} 
            />
          </ListItemAction>
        </ListItem>
        <ListItem>
          <ListItemIcon name="moon" />
          <ListItemText 
            primary="Dark Mode" 
            secondary="Use dark theme" 
          />
          <ListItemAction>
            <Button 
              variant="primary" 
              size="small" 
              title="Auto" 
              onPress={() => console.log('Toggle theme')} 
            />
          </ListItemAction>
        </ListItem>
      </List>

      <ThemedText type="h6" style={{ marginTop: 24 }}>List with Labels (Section Headers)</ThemedText>
      <List variant="elevated" style={{ marginTop: 8 }}>
        <ListLabel>General Settings</ListLabel>
        <ListItem>
          <ListItemIcon name="gear" />
          <ListItemText primary="App Settings" secondary="Configure application preferences" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="bell" />
          <ListItemText primary="Notifications" secondary="Manage notification settings" />
        </ListItem>
        
        <ListLabel>Account</ListLabel>
        <ListItem>
          <ListItemIcon name="person" />
          <ListItemText primary="Profile" secondary="Edit your profile information" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="lock" />
          <ListItemText primary="Privacy" secondary="Privacy and security settings" />
        </ListItem>
        
        <ListLabel variant="secondary">Help & Support</ListLabel>
        <ListItem>
          <ListItemIcon name="questionmark.circle" />
          <ListItemText primary="FAQ" secondary="Frequently asked questions" />
        </ListItem>
        <ListItem>
          <ListItemIcon name="envelope" />
          <ListItemText primary="Contact Us" secondary="Get in touch with support" />
        </ListItem>
      </List>

      <ThemedText type="h6" style={{ marginTop: 24 }}>Disabled Items</ThemedText>
      <List variant="elevated" style={{ marginTop: 8 }}>
        <ListItem onPress={() => console.log('Active item')}>
          <ListItemIcon name="checkmark.circle" color="#22c55e" />
          <ListItemText primary="Active Item" secondary="This item is interactive" />
        </ListItem>
        <ListItem disabled>
          <ListItemIcon name="xmark.circle" />
          <ListItemText primary="Disabled Item" secondary="This item is not available" />
        </ListItem>
        <ListItem onPress={() => console.log('Another active item')}>
          <ListItemIcon name="info.circle" color="#0ea5e9" />
          <ListItemText primary="Another Active Item" secondary="This one works too" />
        </ListItem>
      </List>
    </ThemedView>
  );
}

function TabsShowcase() {
  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Basic Tabs Example</ThemedText>
      <Tabs defaultValue="overview" style={{ marginTop: 8 }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ThemedText type="body">
            This is the overview content. The Tab component provides a clean way to organize content into sections.
          </ThemedText>
        </TabsContent>
        <TabsContent value="details">
          <ThemedText type="body">
            This is the details content. You can switch between tabs by tapping on the triggers above.
          </ThemedText>
        </TabsContent>
        <TabsContent value="settings">
          <ThemedText type="body">
            This is the settings content. The active tab has a dark badge style while inactive tabs have a light style.
          </ThemedText>
        </TabsContent>
      </Tabs>

      <ThemedText type="h6" style={{ marginTop: 24 }}>Many Tabs with Horizontal Scroll</ThemedText>
      <Tabs defaultValue="tab1" style={{ marginTop: 8 }}>
        <TabsList>
          <TabsTrigger value="tab1">タブ1</TabsTrigger>
          <TabsTrigger value="tab2">タブ2</TabsTrigger>
          <TabsTrigger value="tab3">タブ3</TabsTrigger>
          <TabsTrigger value="tab4">タブ4</TabsTrigger>
          <TabsTrigger value="tab5">タブ5</TabsTrigger>
          <TabsTrigger value="tab6">タブ6</TabsTrigger>
          <TabsTrigger value="tab7">Very Long Tab Name</TabsTrigger>
          <TabsTrigger value="tab8">Tab 8</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <ThemedText type="body">コンテンツ 1 - 横スクロールが動作することを確認できます。</ThemedText>
        </TabsContent>
        <TabsContent value="tab2">
          <ThemedText type="body">コンテンツ 2 - タブが多い場合の動作を確認。</ThemedText>
        </TabsContent>
        <TabsContent value="tab3">
          <ThemedText type="body">コンテンツ 3</ThemedText>
        </TabsContent>
        <TabsContent value="tab4">
          <ThemedText type="body">コンテンツ 4</ThemedText>
        </TabsContent>
        <TabsContent value="tab5">
          <ThemedText type="body">コンテンツ 5</ThemedText>
        </TabsContent>
        <TabsContent value="tab6">
          <ThemedText type="body">コンテンツ 6</ThemedText>
        </TabsContent>
        <TabsContent value="tab7">
          <ThemedText type="body">コンテンツ 7 - 長いタブ名の場合</ThemedText>
        </TabsContent>
        <TabsContent value="tab8">
          <ThemedText type="body">コンテンツ 8</ThemedText>
        </TabsContent>
      </Tabs>

      <ThemedText type="h6" style={{ marginTop: 24 }}>Controlled Tabs</ThemedText>
      <Tabs defaultValue="home" style={{ marginTop: 8 }}>
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <Card variant="flat" style={{ marginTop: 8 }}>
            <CardContent>
              <ThemedText type="body">
                Welcome to your home dashboard. Here you can see an overview of your recent activity.
              </ThemedText>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card variant="flat" style={{ marginTop: 8 }}>
            <CardContent>
              <ThemedText type="body">
                Manage your profile settings and personal information here.
              </ThemedText>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages">
          <Card variant="flat" style={{ marginTop: 8 }}>
            <CardContent>
              <ThemedText type="body">
                Your messages and conversations appear in this section.
              </ThemedText>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card variant="flat" style={{ marginTop: 8 }}>
            <CardContent>
              <ThemedText type="body">
                Check your latest notifications and alerts here.
              </ThemedText>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ThemedView>
  );
}

function TextareaShowcase() {
  const [baseValue, setBaseValue] = useState('');
  const [borderlessValue, setBorderlessValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Variants</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <Textarea
          placeholder="Base variant textarea"
          variant="base"
          value={baseValue}
          onChangeText={setBaseValue}
        />
        <Textarea
          placeholder="Borderless variant textarea"
          variant="borderless"
          value={borderlessValue}
          onChangeText={setBorderlessValue}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Sizes</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <Textarea
          placeholder="Small textarea"
          size="small"
          rows={3}
        />
        <Textarea
          placeholder="Medium textarea (default)"
          size="medium"
          rows={4}
        />
        <Textarea
          placeholder="Large textarea"
          size="large"
          rows={5}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>With Labels</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <Textarea
          label="Description"
          placeholder="Enter description"
          rows={3}
        />
        <Textarea
          label="Comments"
          placeholder="Leave your comments"
          variant="borderless"
          rows={4}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Error State</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <Textarea
          label="Feedback"
          placeholder="Please provide feedback"
          value={errorValue}
          onChangeText={setErrorValue}
          error="This field is required"
          rows={3}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Different Row Counts</ThemedText>
      <View style={{ gap: 16, marginTop: 8 }}>
        <Textarea
          placeholder="2 rows"
          rows={2}
        />
        <Textarea
          placeholder="6 rows"
          rows={6}
        />
        <Textarea
          placeholder="8 rows"
          rows={8}
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Full Width</ThemedText>
      <Textarea
        placeholder="Full width textarea"
        fullWidth
        rows={4}
      />
    </ThemedView>
  );
}

function HeaderShowcase() {
  const scrollY = new Animated.Value(0);

  return (
    <ThemedView style={styles.componentSection}>
      <ThemedText type="h6">Basic Header</ThemedText>
      <View style={styles.headerDemo}>
        <Header title="Basic Header" />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Header with Actions</ThemedText>
      <View style={styles.headerDemo}>
        <Header
          title="Settings"
          leftElement={
            <Button icon="chevron.left" iconOnly size="small" variant="ghost" onPress={() => {}} />
          }
          rightElement={
            <Button title="Save" size="small" onPress={() => {}} />
          }
        />
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Fixed Header with Blur Effect</ThemedText>
      <ThemedText type="caption" style={{ marginBottom: 8 }}>
        Scroll the content below to see the blur effect in action
      </ThemedText>
      <View style={styles.blurDemoContainer}>
        <Header
          title="Fixed Header"
          fixed
          scrollY={scrollY}
          blurThreshold={20}
          blurIntensity={60}
          leftElement={
            <Button icon="line.horizontal.3" iconOnly size="small" variant="ghost" onPress={() => {}} />
          }
          rightElement={
            <Button icon="magnifyingglass" iconOnly size="small" variant="ghost" onPress={() => {}} />
          }
        />
        <ScrollView
          style={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.scrollPadding} />
          {Array.from({ length: 20 }, (_, i) => (
            <Card key={i} variant="flat" style={styles.scrollCard}>
              <CardContent>
                <ThemedText type="body">
                  Scroll item {i + 1} - Keep scrolling to see the header blur effect
                </ThemedText>
              </CardContent>
            </Card>
          ))}
        </ScrollView>
      </View>

      <ThemedText type="h6" style={{ marginTop: 16 }}>Header Variants</ThemedText>
      <View style={styles.headerVariants}>
        <View style={styles.headerDemo}>
          <ThemedText type="caption">With Border</ThemedText>
          <Header title="With Border" showBorder={true} />
        </View>
        
        <View style={styles.headerDemo}>
          <ThemedText type="caption">Without Border</ThemedText>
          <Header title="No Border" showBorder={false} />
        </View>
        
        <View style={styles.headerDemo}>
          <ThemedText type="caption">Without Shadow</ThemedText>
          <Header title="No Shadow" showShadow={false} />
        </View>
      </View>
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
  headerDemo: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  headerVariants: {
    marginTop: 8,
  },
  blurDemoContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollContent: {
    flex: 1,
  },
  scrollPadding: {
    height: Spacing[16], // Add padding to account for fixed header
  },
  scrollCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
});