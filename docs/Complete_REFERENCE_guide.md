# Complete Expo Boilerplate Reference Guide

This is a comprehensive reference for all components, screens, contexts, services, and utilities in the Expo Boilerplate. **Use this as a single source of truth to avoid code duplication.**

## 📋 Quick Component Checklist

**Before creating any component, check this list first!**

### ✅ Available UI Components (24 total)
- Button, Text, View, Card, Icon, Avatar, Checkbox, Modal
- LoadingSpinner, LoadingScreen, SplashLoader, SkeletonCard
- TabBarIcon, ThemeStatusBar, ThemeToast, EnhancedIcon
- HeroSection, List, ListItem, ListSection, ListDivider
- HorizontalCardScroll, LazyImage, GallerySlider, ButtonGroup, CountdownTimer

### ✅ Available Form Components (5 total)
- TextInput, MaskedTextInput, OTPInput, Select, SimpleDatePicker

### ✅ Available Layout Components (2 total)
- Container, KeyboardAvoidingContainer

### ✅ Available Navigation Components (4 total)
- ThemedStackScreen, BackButton, Header, BottomTabNavigator

### ✅ Available Screens (4 total)
- AuthScreen (13 variants), SettingsScreen, OnboardingScreen, SplashScreen

---

## 🎨 UI Components Reference

### Button Component ✅
**Location**: `src/components/ui/Button.tsx`

```typescript
interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'success' | 'warning' | 'error' | 'outline-error' | 'outline-warning';
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  textStyle?: TextStyle;
  iconColor?: string;
  iconStyle?: TextStyle;
  onPress?: (event: any) => void;
  style?: ViewStyle;
  // + all TouchableOpacityProps
}
```

**Usage Examples:**
```tsx
// Basic button
<Button title="Click Me" />

// Primary with icon and size
<Button 
  title="Save Changes" 
  variant="primary" 
  size="large"
  leftIcon="save-outline" 
  onPress={() => handleSave()}
/>

// Loading state
<Button 
  title="Submitting..." 
  loading={true} 
  disabled={true}
/>

// Ghost button with right icon
<Button 
  title="Settings" 
  variant="ghost" 
  rightIcon="settings-outline"
  iconColor="#007AFF"
/>
```

**Features**: 
- ✅ RTL support with automatic icon positioning
- ✅ 10 variants (primary, secondary, outline, outline-white, ghost, success, warning, error, outline-error, outline-warning)
- ✅ 5 sizes (xs, small, medium, large, xl)
- ✅ Loading states with spinner
- ✅ Left/right icon support
- ✅ Theme integration

---

### Text Component ✅
**Location**: `src/components/ui/Text.tsx`

```typescript
interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
  // + all React Native TextProps
}
```

**Usage Examples:**
```tsx
<Text variant="title">Welcome Back</Text>
<Text variant="subtitle" color="#666">Please sign in to continue</Text>
<Text variant="body">Regular paragraph text</Text>
<Text variant="caption">Small descriptive text</Text>
<Text variant="label">Form field label</Text>
```

**Features**: 
- ✅ 5 variants with different font sizes and weights
- ✅ Automatic RTL text alignment and writing direction
- ✅ Theme integration for consistent typography

---

### View Component ✅
**Location**: `src/components/ui/View.tsx`

```typescript
interface RTLViewProps extends RNViewProps {
  children?: React.ReactNode;
  
  // RTL-aware style props
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  marginLeft?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginStart?: number;
  marginEnd?: number;
  paddingStart?: number;
  paddingEnd?: number;
  left?: number;
  right?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  
  // RTL control
  enableRTL?: boolean; // Applies RTL transformations from context
  forceRTL?: boolean;  // Forces RTL behavior regardless of context
  forceLTR?: boolean;  // Forces LTR behavior regardless of context
  
  style?: ViewStyle;
  // + all React Native ViewProps
}
```

**Usage Examples:**
```tsx
// Basic view (no RTL by default)
<View style={{ padding: 16 }}>
  <Text>Content</Text>
</View>

// Enable RTL from global context
<MiniView enableRTL style={{ flexDirection: 'row' }}>
  <Text>RTL-aware layout</Text>
</MiniView>

// Force RTL regardless of context
<View forceRTL>
  <Text>Always RTL</Text>
</View>

// Force LTR regardless of context
<View forceLTR>
  <Text>Always LTR</Text>
</View>
```

**Features**: 
- ✅ Opt-in RTL support (not applied by default)
- ✅ Automatic margin/padding/positioning transformation
- ✅ Logical properties support (marginStart, marginEnd, etc.)
- ✅ Force RTL/LTR options

---

### Card Component ✅
**Location**: `src/components/ui/Card.tsx`

```typescript
interface CardProps extends ViewProps {
  // Basic props
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  colorScheme?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'white';
  padding?: 'none' | 'small' | 'medium' | 'large';
  disabled?: boolean;
  
  // Header section
  title?: string;
  subtitle?: string;
  headerIcon?: IconName;
  headerActions?: React.ReactNode;
  headerSpacing?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  headerBorder?: boolean;
  
  // Footer section
  footer?: React.ReactNode;
  actions?: CardAction[];
  
  // Visual enhancements
  image?: React.ReactNode;
  badge?: string;
  badgeColor?: CardColorScheme;
  
  // Layout options
  horizontal?: boolean;
  style?: ViewStyle;
  // + all React Native ViewProps
}

interface CardAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  leftIcon?: IconName;
  rightIcon?: IconName;
}
```

**Usage Examples:**
```tsx
// Simple card
<Card title="Settings" subtitle="Manage preferences">
  <Text>Card content goes here</Text>
</Card>

// Card with header, image, and actions
<Card 
  title="User Profile"
  subtitle="John Doe"
  headerIcon="person-outline"
  badge="Pro"
  badgeColor="warning"
  image={<Image source={{ uri: 'avatar.jpg' }} />}
  actions={[
    { label: 'Edit', onPress: () => {}, variant: 'primary' },
    { label: 'Share', onPress: () => {}, variant: 'outline', rightIcon: 'share-outline' }
  ]}
  onPress={() => navigate('Profile')}
/>

// Horizontal card layout
<Card 
  title="Quick Action"
  horizontal={true}
  variant="elevated"
  colorScheme="primary"
/>
```

**Features**: 
- ✅ Header with title, subtitle, icon, and custom actions
- ✅ Footer with custom content and action buttons
- ✅ Badge support with color schemes
- ✅ Image integration
- ✅ Horizontal and vertical layouts
- ✅ 4 variants and 8 color schemes (including white)
- ✅ Disabled state support
- ✅ RTL support

---

### Avatar Component ✅
**Location**: `src/components/ui/Avatar.tsx`

```typescript
interface AvatarProps extends TouchableOpacityProps {
  // Image properties
  source?: { uri: string } | number;
  alt?: string;
  
  // Fallback content
  name?: string;
  initials?: string;
  fallbackIcon?: IconName;
  
  // Styling
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'circle' | 'rounded' | 'square';
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  
  // Status indicator
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
  statusSize?: number;
  
  // Badge/notification
  badge?: string | number;
  showBadge?: boolean;
  badgeColor?: string;
  badgeTextColor?: string;
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Custom styles
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  // + all TouchableOpacityProps when onPress is provided
}
```

**Usage Examples:**
```tsx
// Avatar with image and status
<Avatar 
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="lg"
  status="online"
  showStatus={true}
  onPress={() => openProfile()}
/>

// Avatar with initials and badge
<Avatar 
  name="John Doe"
  size="md"
  variant="rounded"
  badge={5}
  showBadge={true}
  badgeColor="#FF3B30"
/>

// Avatar with fallback icon
<Avatar 
  fallbackIcon="person-outline"
  size="sm"
  variant="circle"
  backgroundColor="#007AFF"
  textColor="white"
/>
```

**Features**: 
- ✅ 6 sizes (xs to xxl)
- ✅ 3 variants (circle, rounded, square)
- ✅ Status indicators (online, offline, busy, away)
- ✅ Badge support with numbers or text
- ✅ Automatic initials generation from name
- ✅ Fallback icon support
- ✅ Interactive with onPress support

---

### Checkbox Component ✅
**Location**: `src/components/ui/Checkbox.tsx`

```typescript
interface CheckboxProps extends Omit<TouchableOpacityProps, 'onPress'> {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string | React.ReactNode; // Accepts string or custom React element
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  error?: string;
  required?: boolean;
  onPress?: (checked: boolean) => void;
  labelStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  checkboxStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  checkedIcon?: IconName;
  uncheckedIcon?: IconName;
  indeterminateIcon?: IconName;
  animate?: boolean;
  style?: ViewStyle;
  // + TouchableOpacityProps except onPress
}
```

**Usage Examples:**
```tsx
// Basic checkbox
<Checkbox 
  label="I agree to the terms and conditions"
  checked={agreed}
  onPress={(checked) => setAgreed(checked)}
/>

// Checkbox with description and error
<Checkbox 
  label="Newsletter Subscription"
  description="Receive weekly updates about new features"
  checked={subscribed}
  onPress={setSubscribed}
  required={true}
  error={validationError}
  variant="error"
/>

// Custom styled checkbox
<Checkbox 
  label="Remember me"
  size="small"
  variant="success"
  checkedIcon="checkmark-circle"
  animate={true}
/>

// Indeterminate state
<Checkbox
  label="Select All"
  indeterminate={someSelected}
  checked={allSelected}
  onPress={handleSelectAll}
/>

// Custom label with clickable link
<Checkbox
  label={
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
      <Text style={{ fontSize: 14, color: '#333' }}>I agree to </Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
        <Text style={{ fontSize: 14, color: '#007AFF', textDecorationLine: 'underline' }}>
          Terms and Conditions
        </Text>
      </TouchableOpacity>
    </View>
  }
  checked={agreed}
  onPress={setAgreed}
/>
```

**Features**:
- ✅ 3 sizes and 4 variants
- ✅ Indeterminate state support
- ✅ Label supports both string and custom React elements (for inline clickable links)
- ✅ Description and error text
- ✅ Custom icons for checked/unchecked/indeterminate states
- ✅ Smooth animations
- ✅ Required field indicator
- ✅ RTL support

---

### CountdownTimer Component ✅
**Location**: `src/components/ui/CountdownTimer.tsx`

```typescript
interface CountdownTimerProps {
  // Core functionality
  targetTime: Date;
  onExpire?: () => void;
  
  // Appearance
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  colorScheme?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  
  // Content options
  showIcon?: boolean;
  showMilliseconds?: boolean;
  expiredText?: string;
  
  // Icons
  icon?: IconName;
  warningIcon?: IconName;
  dangerIcon?: IconName;
  expiredIcon?: IconName;
  
  // Thresholds (in seconds)
  warningThreshold?: number;
  dangerThreshold?: number;
  
  // Visual customization
  animated?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  
  // Layout
  direction?: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
  
  // Colors override
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  
  // Styles
  style?: ViewStyle;
  textStyle?: any;
  iconStyle?: any;
  containerStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}
```

**Usage Examples:**
```tsx
// Basic countdown timer
<CountdownTimer 
  targetTime={new Date(Date.now() + 60000)} // 1 minute from now
  onExpire={() => console.log('Timer expired!')}
/>

// Customized timer with warning states
<CountdownTimer 
  targetTime={expiryTime}
  size="medium"
  colorScheme="warning"
  dangerThreshold={10}
  warningThreshold={30}
  showIcon={true}
  icon="hourglass-outline"
  onExpire={handleExpiry}
/>

// Vertical layout with custom text
<CountdownTimer 
  targetTime={deadline}
  size="large"
  direction="vertical"
  alignment="center"
  expiredText="انتهى الوقت"
  showIcon={true}
  colorScheme="error"
/>

// Minimal timer without border
<CountdownTimer 
  targetTime={sessionEnd}
  size="small"
  bordered={false}
  showIcon={false}
  colorScheme="ghost"
  textColor="#666"
/>

// High precision timer with milliseconds
<CountdownTimer 
  targetTime={preciseDeadline}
  showMilliseconds={true}
  size="xl"
  colorScheme="primary"
  dangerThreshold={5}
/>
```

**Features**: 
- ✅ 5 sizes (xs to xl) and 6 variants
- ✅ 7 color schemes with automatic state-based colors
- ✅ Dynamic threshold-based color changes (normal → warning → danger → expired)
- ✅ Customizable icons for different timer states
- ✅ Real-time updates (1 second or 100ms intervals)
- ✅ Horizontal and vertical layouts
- ✅ RTL support with proper icon and text alignment
- ✅ Theme integration with consistent spacing and colors
- ✅ Accessibility support with proper labels and roles
- ✅ Monospace font for stable number display
- ✅ Custom expiration callbacks and text
- ✅ Optional millisecond precision display
- ✅ Flexible styling override system

---

### Modal Component ✅
**Location**: `src/components/ui/Modal.tsx`

```typescript
interface ModalProps {
  // Visibility
  visible: boolean;
  onClose: () => void;

  // Content
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;

  // Layout & Appearance
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  position?: 'center' | 'bottom' | 'top';
  variant?: 'default' | 'alert' | 'confirmation' | 'form' | 'custom';
  animation?: 'slide' | 'fade' | 'scale' | 'none';

  // Header
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerIcon?: string;
  headerActions?: React.ReactNode;

  // Footer
  showFooter?: boolean;
  actions?: ModalAction[];
  footerContent?: React.ReactNode;

  // Behavior
  dismissible?: boolean;
  closeOnBackdropPress?: boolean;
  closeOnHardwareBackPress?: boolean;

  // Styling
  backgroundColor?: string;
  backdropColor?: string;
  backdropOpacity?: number;
  borderRadius?: number;
  padding?: number;

  // Scrolling
  scrollable?: boolean;
  scrollViewProps?: any;

  // Advanced
  statusBarTranslucent?: boolean;
  presentationStyle?: 'pageSheet' | 'formSheet' | 'fullScreen' | 'overFullScreen';
  animationDuration?: number;

  // Callbacks
  onShow?: () => void;
  onDismiss?: () => void;
  onRequestClose?: () => void;
}

interface ModalAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}
```

**Usage Examples:**
```tsx
// Simple alert modal
<Modal 
  visible={showAlert}
  onClose={() => setShowAlert(false)}
  title="Confirm Action"
  variant="alert"
  size="small"
  actions={[
    { title: 'Cancel', onPress: () => setShowAlert(false) },
    { title: 'Confirm', onPress: handleConfirm, variant: 'primary' }
  ]}
>
  <Text>Are you sure you want to continue?</Text>
</Modal>

// Form modal with scrollable content
<Modal 
  visible={showForm}
  onClose={() => setShowForm(false)}
  title="Edit Profile"
  subtitle="Update your information"
  size="medium"
  variant="form"
  scrollable={true}
  headerIcon="person-outline"
  showFooter={true}
  footerContent={<Button title="Save Changes" onPress={handleSave} />}
>
  <FormContent />
</Modal>

// Bottom sheet modal
<Modal 
  visible={showSheet}
  onClose={() => setShowSheet(false)}
  position="bottom"
  animation="slide"
  size="large"
  dismissible={true}
  closeOnBackdropPress={true}
>
  <SheetContent />
</Modal>
```

**Features**: 
- ✅ 4 sizes and 3 positions
- ✅ 5 variants with different styling
- ✅ 4 animation types
- ✅ Header with title, subtitle, icon, and actions
- ✅ Footer with custom content and action buttons
- ✅ Scrollable content support
- ✅ Backdrop customization
- ✅ RTL support
- ✅ Keyboard handling

---

### List Components ✅
**Location**: `src/components/ui/List.tsx`

```typescript
// Main List Container
interface ListProps {
  children: React.ReactNode;
  variant?: 'default' | 'inset' | 'sidebar' | 'card';
  showDividers?: boolean;
  dividerVariant?: 'full' | 'inset' | 'middle' | 'none';
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

// Enhanced List Item with extensive features
interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconSize?: number;
  iconBackground?: string;
  leftIconPadding?: number;
  
  // Avatar support
  leftAvatar?: {
    source?: any;
    title?: string;
    size?: AvatarSize;
    variant?: 'circle' | 'square' | 'rounded';
  };
  
  rightContent?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  
  // Item variants and states
  variant?: 'default' | 'compact' | 'expanded' | 'action';
  showChevron?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  multiline?: boolean;
  
  // Collapsible features
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  children?: React.ReactNode;
  
  // Nested list support
  nested?: boolean;
  nestLevel?: number;
  maxNestLevel?: number;
  
  // Styling
  itemStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

// Enhanced List Section with collapsible support
interface ListSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  
  // Collapsible features
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  headerIcon?: IconName;
  
  // Styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

// Enhanced List Divider
interface ListDividerProps {
  variant?: 'full' | 'inset' | 'middle' | 'none';
  style?: ViewStyle;
}
```

**Usage Examples:**
```tsx
// Basic list with enhanced items
<List variant="default" showDividers={true}>
  <ListItem 
    title="Notifications"
    subtitle="Push notifications and alerts"
    leftIcon="notifications-outline"
    showChevron={true}
    onPress={() => navigate('Notifications')}
  />
  <ListItem 
    title="Privacy Settings"
    leftIcon="shield-outline"
    rightContent={<Switch value={privacyEnabled} onValueChange={setPrivacyEnabled} />}
    variant="compact"
  />
</List>


// Collapsible sections with nested lists
<List variant="inset" showDividers={true}>
  <ListSection 
    title="Account Settings"
    subtitle="Manage your account preferences"
    collapsible={true}
    expanded={accountExpanded}
    onToggleExpand={setAccountExpanded}
    headerIcon="person-outline"
  >
    <ListItem 
      title="Profile"
      leftIcon="person-outline"
      badge={{ text: "New", variant: "warning" }}
      onPress={() => navigate('Profile')}
    />
    <ListItem 
      title="Security"
      subtitle="Password and authentication"
      leftIcon="lock-closed-outline"
      nested={true}
      nestLevel={1}
    />
  </ListSection>
  
  <ListDivider variant="middle" />
  
  <ListSection 
    title="Preferences" 
    collapsible={true}
    expanded={prefsExpanded}
    onToggleExpand={setPrefsExpanded}
  >
    <ListItem 
      title="Dark Mode"
      leftIcon="moon-outline"
      rightContent={<Switch value={darkMode} />}
      loading={isToggling}
    />
  </ListSection>
</List>

// Collapsible list items with children
<List variant="default">
  <ListItem 
    title="Settings"
    subtitle="Application preferences"
    leftIcon="settings-outline"
    collapsible={true}
    expanded={settingsExpanded}
    onToggleExpand={setSettingsExpanded}
  >
    <ListItem 
      title="Theme"
      subtitle="Light or dark mode"
      leftIcon="color-palette-outline"
      nested={true}
      nestLevel={1}
    />
    <ListItem 
      title="Language"
      subtitle="Change app language"
      leftIcon="language-outline"
      nested={true}
      nestLevel={1}
    />
  </ListItem>
</List>
```

**Features**: 
- ✅ 4 list variants (default, inset, sidebar, card)
- ✅ 4 list item variants (default, compact, expanded, action)
- ✅ Automatic dividers with 4 variants (full, inset, middle, none)
- ✅ Enhanced section headers with collapsible support
- ✅ Avatar integration with customizable size and variants
- ✅ Advanced badge system with multiple variants
- ✅ Collapsible list items and sections with smooth animations
- ✅ Nested list support with configurable depth levels
- ✅ Loading states and disabled states
- ✅ Multi-line content with description support
- ✅ Icon customization with background colors and padding
- ✅ Selection states and chevron indicators
- ✅ RTL support throughout all components
- ✅ Theme integration with consistent styling

---

### Loading Components ✅

#### LoadingSpinner
**Location**: `src/components/ui/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  position?: 'center' | 'inline';
  style?: ViewStyle;
}
```

#### LoadingScreen
**Location**: `src/components/ui/LoadingScreen.tsx`

```typescript
interface LoadingScreenProps {
  variant?: 'simple' | 'detailed' | 'progress' | 'error';
  title?: string;
  subtitle?: string;
  progress?: number; // 0-100 for progress variant
  actions?: LoadingScreenAction[];
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

interface LoadingScreenAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

**Usage Examples:**
```tsx
// Inline spinner
<LoadingSpinner size="small" position="inline" color="#007AFF" />

// Full screen loading with progress
<LoadingScreen 
  variant="progress"
  title="Loading Content"
  subtitle="Please wait while we fetch your data"
  progress={progressValue}
/>

// Error state with retry action
<LoadingScreen 
  variant="error"
  title="Something went wrong"
  subtitle="Unable to load content"
  actions={[
    { label: 'Retry', onPress: retryLoad, variant: 'primary' },
    { label: 'Go Back', onPress: goBack, variant: 'outline' }
  ]}
/>
```

---

### Icon Component ✅
**Location**: `src/components/ui/Icon.tsx`

```typescript
interface IconProps {
  name: IconName; // Ionicons name
  size?: number;
  color?: string;
  style?: TextStyle;
}

// IconName is a union type of all available Ionicons
type IconName = 'home-outline' | 'person-outline' | 'settings-outline' | ... // 1000+ icons
```

**Usage Examples:**
```tsx
<Icon name="home-outline" size={24} color="#007AFF" />
<Icon name="chevron-forward-outline" /> // Auto-flips in RTL
<Icon name="heart" size={32} color="#FF3B30" style={{ marginTop: 8 }} />
```

**Features**: 
- ✅ 1000+ Ionicons available
- ✅ RTL-aware directional icon flipping
- ✅ Theme color integration
- ✅ TypeScript autocompletion for icon names

---

## 📝 Form Components Reference

### TextInput Component ✅
**Location**: `src/components/forms/TextInput.tsx`

```typescript
interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean; // Auto-enabled for password fields
  style?: TextStyle;
  // + all React Native TextInputProps
}
```

**Usage Examples:**
```tsx
// Basic text input
<TextInput 
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Password input with auto-toggle
<TextInput 
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  showPasswordToggle={true} // Default true
  error={passwordError}
/>

// Input with icons and helper text
<TextInput 
  label="Phone Number"
  placeholder="+1 (555) 123-4567"
  leftIcon="call-outline"
  rightIcon="checkmark-circle-outline"
  helperText="We'll send a verification code to this number"
  keyboardType="phone-pad"
/>

// Multiline text area
<TextInput 
  label="Message"
  placeholder="Enter your message..."
  multiline={true}
  numberOfLines={4}
  textAlignVertical="top"
/>
```

**Features**: 
- ✅ Automatic password toggle for secure fields
- ✅ Left and right icon support
- ✅ Error and helper text display
- ✅ RTL support with proper text alignment
- ✅ Theme integration
- ✅ iOS password suggestion prevention

---

### OTPInput Component ✅
**Location**: `src/components/forms/OTPInput.tsx`

```typescript
interface OTPInputProps {
  length: number; // Number of OTP digits (usually 4-6)
  onChangeText: (otp: string) => void;
  onComplete?: (otp: string) => void; // Called when all digits filled
  error?: string;
  label?: string;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  style?: ViewStyle;
}
```

**Usage Examples:**
```tsx
// 6-digit OTP input
<OTPInput 
  length={6}
  onChangeText={setOtp}
  onComplete={handleOtpComplete}
  label="Verification Code"
  autoFocus={true}
  error={otpError}
/>

// 4-digit PIN input
<OTPInput 
  length={4}
  onChangeText={setPin}
  secureTextEntry={true}
  label="Enter PIN"
/>
```

**Features**: 
- ✅ Configurable length (4-8 digits)
- ✅ Auto-focus and navigation between inputs
- ✅ Completion callback when all digits entered
- ✅ Secure text entry for PINs
- ✅ Error state display
- ✅ RTL support

---

### MaskedTextInput Component ✅
**Location**: `src/components/forms/MaskedTextInput.tsx`

```typescript
interface MaskedTextInputProps {
  mask: MaskType;
  value?: string;
  onChangeText?: (maskedText: string, unmaskedText: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  style?: ViewStyle;
}

type MaskType = 'phone' | 'credit-card' | 'date' | 'currency' | 'custom';
```

**Usage Examples:**
```tsx
// Phone number mask
<MaskedTextInput 
  label="Phone Number"
  mask="phone"
  placeholder="(555) 123-4567"
  value={phone}
  onChangeText={(masked, unmasked) => {
    setPhone(masked);
    setPhoneNumber(unmasked);
  }}
/>

// Credit card mask
<MaskedTextInput 
  label="Card Number"
  mask="credit-card"
  placeholder="1234 5678 9012 3456"
  value={cardNumber}
  onChangeText={setCardNumber}
/>

// Date mask
<MaskedTextInput 
  label="Birth Date"
  mask="date"
  placeholder="MM/DD/YYYY"
  value={birthDate}
  onChangeText={setBirthDate}
/>
```

**Features**: 
- ✅ Pre-built masks for common formats
- ✅ Returns both masked and unmasked values
- ✅ Real-time formatting as user types
- ✅ Custom mask pattern support

---

### Select Component ✅
**Location**: `src/components/forms/Select.tsx`

```typescript
interface SelectProps {
  options: SelectOption[];
  value?: any;
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  style?: ViewStyle;
}

interface SelectOption {
  label: string;
  value: any;
  icon?: IconName;
  disabled?: boolean;
  description?: string;
}
```

**Usage Examples:**
```tsx
// Basic select
<Select 
  label="Country"
  placeholder="Select your country"
  options={[
    { label: 'United States', value: 'US', icon: 'flag-outline' },
    { label: 'Canada', value: 'CA', icon: 'flag-outline' },
    { label: 'Mexico', value: 'MX', icon: 'flag-outline' },
  ]}
  value={selectedCountry}
  onSelect={(option) => setSelectedCountry(option.value)}
/>

// Searchable select
<Select 
  label="City"
  placeholder="Search for a city"
  options={cityOptions}
  searchable={true}
  onSelect={handleCitySelect}
/>

// Multiple selection
<Select 
  label="Interests"
  placeholder="Select your interests"
  options={interestOptions}
  multiple={true}
  onSelect={handleInterestSelect}
/>
```

**Features**:
- ✅ Single and multiple selection
- ✅ Searchable options
- ✅ Icons in options
- ✅ Option descriptions
- ✅ Disabled options
- ✅ 3 variants and sizes

---

### SimpleDatePicker Component ✅
**Location**: `src/components/forms/SimpleDatePicker.tsx`

```typescript
interface SimpleDatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string; // ISO format YYYY-MM-DD
  onDateChange: (date: string) => void;
  error?: string;
  helperText?: string;
  maxDate?: Date;
  disabled?: boolean;
  containerStyle?: ViewStyle;

  // Customizable labels for modal
  modalTitle?: string;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}
```

**Usage Examples:**
```tsx
// Basic date picker with English labels (default)
<SimpleDatePicker
  label="Birth Date"
  placeholder="Select your birth date"
  value={birthDate}
  onDateChange={setBirthDate}
  error={birthDateError}
  maxDate={new Date()}
/>

// Arabic date picker with custom labels
<SimpleDatePicker
  label="تاريخ الميلاد"
  placeholder="اختر تاريخ ميلادك"
  value={birthDate}
  onDateChange={(date) => {
    setBirthDate(date);
    setBirthDateError('');
  }}
  error={birthDateError}
  maxDate={new Date()}
  modalTitle="اختر تاريخ الميلاد"
  dayLabel="اليوم"
  monthLabel="الشهر"
  yearLabel="السنة"
  cancelButtonText="إلغاء"
  confirmButtonText="تأكيد"
/>

// Simple date picker with helper text
<SimpleDatePicker
  label="Date of Birth"
  value={birthDate}
  onDateChange={setBirthDate}
  helperText="Required for age verification"
  maxDate={new Date()}
  modalTitle="Select Your Date of Birth"
  confirmButtonText="Done"
/>

// Used in AuthScreen customFields
<AuthScreen
  variant="register"
  customFields={
    <SimpleDatePicker
      label="تاريخ الميلاد"
      placeholder="اختر تاريخ ميلادك"
      value={birthDate}
      onDateChange={setBirthDate}
      error={birthDateError}
      maxDate={new Date()}
      modalTitle="اختر تاريخ الميلاد"
      cancelButtonText="إلغاء"
      confirmButtonText="تأكيد"
    />
  }
  onSubmit={handleRegister}
/>
```

**Features**:
- ✅ Simple button-based date picker (no complex ScrollView)
- ✅ Three separate pickers (Day, Month, Year) with chevron up/down buttons
- ✅ Tap-to-increment/decrement selection
- ✅ Modal presentation with backdrop
- ✅ **Fully customizable labels** (modal title, day/month/year labels, buttons)
- ✅ Default English labels with easy localization support
- ✅ Arabic month names with RTL support
- ✅ Automatic day adjustment for different month lengths (28-31 days)
- ✅ **Consistent input design** matching TextInput styling
- ✅ Calendar icon at start (left in LTR, right in RTL)
- ✅ Chevron-down icon at end (right in LTR, left in RTL)
- ✅ Theme-aware surface background color
- ✅ Proper RTL support with icon and layout positioning
- ✅ Split action buttons (Cancel/Confirm with customizable text)
- ✅ Full theme integration with sizes, colors, borderRadius
- ✅ Error and helper text support
- ✅ Disabled state with opacity
- ✅ No complex timeouts or refs - simple and maintainable
- ✅ Lightweight implementation (~410 lines)
- ✅ Perfect for registration forms and age verification

---

## 🏗️ Layout & Navigation Components

### Layout Components ✅

#### Container
**Location**: `src/components/layout/Container.tsx`
Safe area aware container with consistent padding and theme integration.

```typescript
interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  safeArea?: boolean;
  style?: ViewStyle;
}
```

#### KeyboardAvoidingContainer
**Location**: `src/components/layout/KeyboardAvoidingContainer.tsx`
Container that automatically adjusts for keyboard appearance.

```typescript
interface KeyboardAvoidingContainerProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
  behavior?: 'height' | 'position' | 'padding';
  style?: ViewStyle;
}
```

### Navigation Components ✅

#### Header
**Location**: `src/components/navigation/Header.tsx`

```typescript
interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  titleStyle?: TextStyle;
  style?: ViewStyle;
}
```

#### BackButton
**Location**: `src/components/navigation/BackButton.tsx`

```typescript
interface BackButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  variant?: 'default' | 'circle' | 'square';
  size?: 'small' | 'medium' | 'large';
  icon?: IconName;
  color?: string;
  style?: ViewStyle;
}
```

#### BottomTabNavigator
**Location**: `src/components/navigation/BottomTabNavigator.tsx`

```typescript
interface TabConfig {
  key: string;
  title: string;
  icon: IconName;
  activeIcon?: IconName;
  badge?: string | number;
  disabled?: boolean;
}

interface BottomTabNavigatorProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: ViewStyle;
}
```

---

## 📱 Screens Reference

### AuthScreen Component ✅
**Location**: `src/screens/AuthScreen.tsx`

**13 Available Variants:**
- `login-email`, `login-phone`, `register`
- `forgot-password`, `forgot-password-email`, `forgot-password-whatsapp`  
- `reset-password`, `verification`, `verification-email`, `verification-whatsapp`
- `social-login`, `account-review`, `account-suspended`, `account-created-successfully`

**6 Layout Options:** `default`, `split`, `centered`, `minimal`, `card`, `fullscreen`

**6 Theme Options:** `light`, `dark`, `gradient`, `branded`, `glassmorphism`, `custom`

```typescript
interface AuthScreenProps {
  variant?: AuthScreenVariant;
  layout?: AuthScreenLayout;
  theme?: AuthScreenTheme;
  
  // Navigation
  showBackButton?: boolean;
  onBackPress?: () => void;
  
  // Content
  content?: AuthScreenContent;
  inputLabels?: AuthInputLabels;
  logo?: React.ReactNode;
  logoSource?: ImageSourcePropType;
  logoSize?: number;
  showTopLeftLogo?: boolean;
  topLeftLogoSource?: ImageSourcePropType;
  topLeftLogoSize?: number;
  backgroundImage?: ImageSourcePropType;
  
  // Social Authentication
  socialProviders?: SocialProvider[];
  showSocialLogin?: boolean;
  socialLoginTitle?: string;
  
  // Form Configuration
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showTermsCheckbox?: boolean;
  termsUrl?: string; // URL to open when terms link is clicked
  onTermsPress?: () => void; // Custom handler for terms link (overrides termsUrl)
  termsLinkText?: string; // The clickable part of the terms text
  termsPrefix?: string; // Text before the clickable link
  enableBiometric?: boolean;
  verificationContact?: string;
  
  // Validation
  enableValidation?: boolean;
  customValidation?: (data: AuthFormData) => { [key: string]: string } | null;
  
  // Loading States
  isLoading?: boolean;
  loadingText?: string;
  
  // Callbacks
  onSubmit?: (data: AuthFormData) => Promise<void> | void;
  onSocialLogin?: (provider: string) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSecondaryAction?: () => void;
  onFooterLinkPress?: () => void;
  onBiometricLogin?: () => Promise<void> | void;
  
  // Customization
  backgroundColor?: string;
  gradientColors?: [string, string];
  overlayOpacity?: number;
  borderRadius?: number;
  
  // Animation
  enableAnimations?: boolean;
  animationDuration?: number;
  
  // Accessibility
  testID?: string;
  accessible?: boolean;
  
  // Style overrides
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  formStyle?: ViewStyle;
}

interface AuthFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  code?: string;
  rememberMe?: boolean;
  agreeToTerms?: boolean;
}

interface SocialProvider {
  name: string;
  icon: IconName;
  color: string;
  onPress: () => void;
}

interface AuthScreenContent {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  footerText?: string;
  footerLinkText?: string;
}

interface AuthInputLabels {
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  verificationCodeLabel?: string;
  rememberMeLabel?: string;
  termsLabel?: string;
  forgotPasswordLabel?: string;
  biometricLabel?: string;
  continueWithLabel?: string;
}
```

**Usage Examples:**
```tsx
// Email login with social providers
<AuthScreen 
  variant="login-email"
  layout="centered"
  theme="gradient"
  gradientColors={['#667eea', '#764ba2']}
  showSocialLogin={true}
  socialProviders={[
    { name: 'Google', icon: 'logo-google', color: '#DB4437', onPress: handleGoogleLogin },
    { name: 'Apple', icon: 'logo-apple', color: '#000000', onPress: handleAppleLogin },
    { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', onPress: handleFacebookLogin }
  ]}
  content={{
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
    footerText: "Don't have an account?",
    footerLinkText: 'Sign Up'
  }}
  onSubmit={handleLogin}
  onFooterLinkPress={() => navigate('Register')}
/>

// Registration with inline clickable terms link (English)
<AuthScreen
  variant="register"
  layout="card"
  showTermsCheckbox={true}
  termsUrl="https://yoursite.com/privacy-policy"
  termsPrefix="I agree to"
  termsLinkText="Terms of Service and Privacy Policy"
  enableValidation={true}
  content={{
    title: 'Create Account',
    subtitle: 'Join thousands of users',
    primaryButtonText: 'Create Account'
  }}
  onSubmit={handleRegister}
  customValidation={validateRegistration}
/>

// Registration with inline clickable terms link (Arabic)
<AuthScreen
  variant="register"
  layout="card"
  showTermsCheckbox={true}
  termsUrl="https://www.upsmart.tech/yarwy/privacy-policy.html"
  termsPrefix="أوافق على"
  termsLinkText="شروط وأحكام الاستخدام"
  content={{
    title: 'إنشاء حساب',
    primaryButtonText: 'تسجيل'
  }}
  onSubmit={handleRegister}
/>

// Registration with custom terms handler
<AuthScreen
  variant="register"
  layout="card"
  showTermsCheckbox={true}
  onTermsPress={() => navigate('TermsScreen')}
  termsPrefix="I accept the"
  termsLinkText="Terms & Conditions"
  content={{
    title: 'Sign Up',
    primaryButtonText: 'Create Account'
  }}
  onSubmit={handleRegister}
/>

// OTP Verification
<AuthScreen 
  variant="verification-email"
  layout="minimal"
  verificationContact="user@example.com"
  content={{
    title: 'Check Your Email',
    description: 'We sent a 6-digit code to your email address'
  }}
  onSubmit={handleVerifyOTP}
  onSecondaryAction={resendCode}
/>

// Account status screens
<AuthScreen 
  variant="account-created-successfully"
  layout="centered"
  enableAnimations={true}
  content={{
    primaryButtonText: 'Get Started',
    secondaryButtonText: 'View Profile'
  }}
  onSubmit={() => navigate('Home')}
  onSecondaryAction={() => navigate('Profile')}
/>
```

**Built-in Features:**
- ✅ Form validation with custom rules
- ✅ Social authentication integration
- ✅ Biometric authentication option
- ✅ **Inline clickable terms & conditions** - checkbox with customizable prefix text and clickable link
- ✅ Flexible terms link - supports URL opening or custom navigation handler
- ✅ Background images and gradients
- ✅ Smooth animations and transitions
- ✅ RTL support throughout
- ✅ Accessibility optimized
- ✅ Keyboard handling
- ✅ Loading states and error handling

---

### OnboardingScreen Component ✅
**Location**: `src/screens/OnboardingScreen.tsx`

```typescript
export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: IconName;
  image?: ImageSourcePropType;
  backgroundColor?: string;
  textColor?: string;
  features?: string[];
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'bounce';
}

export interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  showSkipButton?: boolean;
  showProgressDots?: boolean;
  showProgressBar?: boolean;
  enableSwipeGestures?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  backgroundImage?: ImageSourcePropType;
  overlayOpacity?: number;
  imageWidth?: number;
  imageHeight?: number;
  onComplete?: () => void;
  onSkip?: () => void;
  onSlideChange?: (index: number) => void;
  skipButtonText?: string;
  nextButtonText?: string;
  doneButtonText?: string;
  enableAnimations?: boolean;
  style?: ViewStyle;
  testID?: string;
}
```

**Usage Examples:**
```tsx
// Basic onboarding with images
<OnboardingScreen
  slides={onboardingSlides}
  showSkipButton={true}
  showProgressDots={true}
  enableAnimations={true}
  skipButtonText="Skip"
  nextButtonText="Next"
  doneButtonText="Get Started"
  onComplete={() => handleOnboardingComplete()}
  onSkip={() => handleSkip()}
/>

// Custom image sizes (140x140 pixels - default size)
<OnboardingScreen
  slides={cashFlowSlides}
  showSkipButton={true}
  showProgressDots={true}
  enableSwipeGestures={true}
  enableAnimations={true}
  imageWidth={140}
  imageHeight={140}
  skipButtonText="تخطي"
  nextButtonText="التالي"
  doneButtonText="ابدأ الآن"
  onComplete={onComplete}
  onSkip={onSkip}
/>

// Auto-play onboarding
<OnboardingScreen
  slides={tutorialSlides}
  autoPlay={true}
  autoPlayInterval={5000}
  showProgressBar={true}
  backgroundImage={require('./background.jpg')}
  overlayOpacity={0.3}
  onComplete={handleTutorialComplete}
/>
```

**Features**:
- ✅ Customizable image dimensions with `imageWidth` and `imageHeight` props
- ✅ Support for both icons and images in slides
- ✅ 4 animation types (fadeIn, slideUp, scale, bounce)
- ✅ Progress indicators (dots or bar)
- ✅ Auto-play functionality with configurable intervals
- ✅ Swipe gesture navigation
- ✅ Background image support with overlay
- ✅ Smooth animations and transitions
- ✅ RTL support with proper icon and text alignment
- ✅ Theme integration for consistent styling
- ✅ Skip button with customizable text
- ✅ Features list display for each slide
- ✅ Back button navigation between slides

---

### SettingsScreen Component ✅
**Location**: `src/screens/SettingsScreen.tsx`

```typescript
interface SettingsScreenProps {
  layout?: 'default' | 'grouped' | 'minimal' | 'detailed';
  theme?: 'auto' | 'light' | 'dark' | 'gradient';
  user?: UserInfo;
  showUserSection?: boolean;
  showQuickActions?: boolean;
  showSearchBar?: boolean;
  enableRefresh?: boolean;
  customSections?: SettingSection[];
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  style?: ViewStyle;
  testID?: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
  memberSince?: Date;
}

interface SettingSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: IconName;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: IconName;
  value?: string | boolean | number;
  type: 'navigation' | 'toggle' | 'info' | 'action' | 'picker' | 'slider';
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  onValueChange?: (value: any) => void;
  color?: string;
  rightIcon?: IconName;
  badge?: string;
  disabled?: boolean;
  destructive?: boolean;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}
```

**Built-in Settings Sections:**
1. **Account** - Privacy, Subscription, Biometric Auth
2. **Notifications** - Push, Email toggles
3. **Appearance** - Dark mode, Language, Font size
4. **Data & Storage** - Auto backup, Offline mode, Clear cache
5. **Support & Feedback** - Help center, Contact, Rate app
6. **About** - Version, Terms, Privacy policy
7. **Danger Zone** - Logout, Delete account

**Usage Examples:**
```tsx
// Default settings screen
<SettingsScreen 
  user={{
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isPremium: true,
    memberSince: new Date('2023-01-15')
  }}
  showUserSection={true}
  showQuickActions={true}
  enableRefresh={true}
  onLogout={handleLogout}
  onDeleteAccount={handleDeleteAccount}
/>

// Custom settings sections
<SettingsScreen 
  customSections={[
    {
      id: 'app-settings',
      title: 'App Settings',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
        {
          id: 'language',
          title: 'Language',
          icon: 'language-outline',
          type: 'picker',
          value: currentLanguage,
          options: languageOptions,
          onPress: showLanguagePicker
        }
      ]
    }
  ]}
  layout="grouped"
  theme="dark"
/>
```

**Features:**
- ✅ Pre-built comprehensive settings sections
- ✅ User profile section with premium indicators
- ✅ Quick action buttons
- ✅ Animated header on scroll
- ✅ Pull-to-refresh support
- ✅ Persistent storage for settings
- ✅ RTL support with proper List components
- ✅ Theme integration

---

## 🧠 Contexts & State Management

### ThemeContext ✅
**Location**: `src/contexts/ThemeContext.tsx`

```typescript
interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  colorScheme: string;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: string) => void;
  toggleTheme: () => void;
}

interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    placeholder: string;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
```

**Usage:**
```tsx
const { theme, toggleTheme, setColorScheme, themeMode } = useTheme();

// Apply theme colors
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>

// Toggle theme
<Button title="Toggle Theme" onPress={toggleTheme} />

// Set specific mode
<Button title="Dark Mode" onPress={() => setThemeMode('dark')} />
```

### RTLContext ✅
**Location**: `src/contexts/RTLContext.tsx`

```typescript
interface RTLContextType {
  isRTL: boolean;
  setRTL: (enabled: boolean) => void;
  toggleRTL: () => void;
}
```

### Other Contexts ✅
- **AuthContext**: Authentication state, user data, login/logout methods
- **AppContext**: Global application state and configuration  
- **SplashContext**: Splash screen visibility control
- **CartContext**: Shopping cart state and operations

---

## ⚙️ Services & Utilities

### Services ✅

#### StorageService
**Location**: `src/services/storage.ts`
Type-safe AsyncStorage wrapper with error handling.

#### AuthService  
**Location**: `src/services/auth.ts`
Authentication logic, token management, and user session handling.

#### CartService
**Location**: `src/services/cart.ts`
Shopping cart operations, persistence, and calculations.

#### FirstTimeService
**Location**: `src/services/firstTime.service.ts`
First-time user experience tracking and onboarding state.

#### NotificationService
**Location**: `src/services/notifications.ts`
Push notification registration, handling, and permissions.

---

## 🧭 Navigation Configuration

### Navigation Options Factory ✅
**Location**: `src/config/navigationConfig.ts`

The `navigationConfig` provides standardized navigation options for React Navigation with theme integration and multiple animation types. This utility ensures consistent navigation behavior across all apps in the boilerplate.

```typescript
// Main configuration function
function createNavigationOptions(
  theme: any, 
  animationType: 'instant' | 'fast' | 'default' = 'default'
): StackNavigationOptions

// Convenience functions
function createInstantNavigationOptions(theme: any): StackNavigationOptions
function createFastNavigationOptions(theme: any): StackNavigationOptions  
function createDefaultNavigationOptions(theme: any): StackNavigationOptions

type NavigationAnimationType = 'instant' | 'fast' | 'default'
```

#### Animation Types

**1. Instant Navigation (`'instant'`)**
- **Duration**: 0ms (no animations)
- **Gestures**: Disabled
- **Use cases**: Maximum performance apps, testing, accessibility
- **Platforms**: iOS and Android optimized

**2. Fast Navigation (`'fast'`)**
- **Duration**: 100ms  
- **Gestures**: Enabled with responsive settings (15px trigger)
- **Use cases**: Quick interactions, productivity apps
- **Features**: Velocity-aware gestures, native driver

**3. Default Navigation (`'default'`)**
- **Duration**: 250ms
- **Gestures**: Enabled with standard settings (25px trigger)  
- **Use cases**: Standard apps, smooth user experience
- **Features**: Standard React Navigation behavior

#### Core Features

✅ **Theme Integration**: Automatic background color matching
✅ **Platform Optimization**: Different settings for iOS/Android
✅ **Gesture Support**: Configurable swipe-to-go-back
✅ **Native Performance**: Uses native driver when possible
✅ **RTL Compatible**: Works with RTL layout directions
✅ **Consistent API**: Same interface across all animation types

#### Configuration Options

Each animation type provides these navigation options:

```typescript
interface NavigationOptions {
  // Core settings
  headerShown: boolean;              // Always false for custom headers
  contentStyle: { backgroundColor };  // Theme-aware background
  cardStyle: { backgroundColor };     // Theme-aware card background
  
  // Animation settings
  animationEnabled: boolean;          // Enable/disable animations
  transitionSpec: {                  // Custom transition timing
    open: { duration, useNativeDriver };
    close: { duration, useNativeDriver };
  };
  
  // Platform-specific
  animation: 'slide_from_right' | 'none';  // Android animation type
  presentation: 'card';                     // iOS presentation style
  
  // Gesture configuration
  gestureEnabled: boolean;                  // Enable swipe gestures
  gestureDirection: 'horizontal';           // Gesture direction
  gestureResponseDistance: { horizontal };  // Trigger distance
  gestureVelocityImpact: number;           // Velocity sensitivity
}
```

#### Usage Examples

**Basic Usage:**
```tsx
import { createNavigationOptions } from '@/config/navigationConfig';

function ThemedStack() {
  const { theme } = useTheme();
  const navigationOptions = createNavigationOptions(theme, 'fast');
  
  return (
    <Stack screenOptions={navigationOptions}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Profile" />
    </Stack>
  );
}
```

**Convenience Functions:**
```tsx
import { 
  createInstantNavigationOptions,
  createFastNavigationOptions,
  createDefaultNavigationOptions 
} from '@/config/navigationConfig';

// For maximum performance
const instantOptions = createInstantNavigationOptions(theme);

// For quick interactions  
const fastOptions = createFastNavigationOptions(theme);

// For standard experience
const defaultOptions = createDefaultNavigationOptions(theme);
```

**Using Different Animation Types:**
```tsx
// For maximum performance (instant navigation)
function PerformanceLayout() {
  const { theme } = useTheme();
  const options = createInstantNavigationOptions(theme);
  
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="screen1" />
      <Stack.Screen name="screen2" />
    </Stack>
  );
}

// For quick interactions (fast navigation)
function FastLayout() {
  const { theme } = useTheme();
  const options = createFastNavigationOptions(theme);
  
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="screen1" />
      <Stack.Screen name="screen2" />
    </Stack>
  );
}

// For standard smooth experience (default navigation)
function StandardLayout() {
  const { theme } = useTheme();
  const options = createDefaultNavigationOptions(theme);
  
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="screen1" />
      <Stack.Screen name="screen2" />
    </Stack>
  );
}
```

**Screen-Specific Overrides:**
```tsx
function AppStack() {
  const { theme } = useTheme();
  const baseOptions = createFastNavigationOptions(theme);
  
  return (
    <Stack screenOptions={baseOptions}>
      <Stack.Screen name="Home" />
      
      {/* Modal screens with custom presentation */}
      <Stack.Screen 
        name="Profile" 
        options={{
          ...baseOptions,
          presentation: 'modal',
          headerTitle: 'Profile'
        }}
      />
      
      {/* Full screen modals */}
      <Stack.Screen 
        name="MediaPlayer" 
        options={{
          ...baseOptions,
          presentation: 'fullScreenModal',
          headerTitle: 'Media Player'
        }}
      />
    </Stack>
  );
}
```


#### Platform-Specific Behavior

**Android:**
- Uses `slide_from_right` animation or `none` for instant
- Configurable `animationDuration` property
- Native gesture support with `gestureEnabled`

**iOS:**
- Uses `card` presentation style
- Native transition handling
- Built-in gesture support

#### Integration with Apps

**Choose the appropriate animation type based on your app's needs:**

- **Instant**: Performance-critical apps, accessibility, testing
- **Fast**: Quick interactions, productivity apps, responsive UX
- **Default**: Standard apps, content-heavy apps, smooth animations

#### Extending the Configuration

To add new animation types, extend the `NavigationAnimationType` union and add cases to the `createNavigationOptions` function:

```typescript
// Add to navigationConfig.ts
export type NavigationAnimationType = 'instant' | 'fast' | 'default' | 'slow';

// Add case in createNavigationOptions function
case 'slow':
  return {
    ...baseOptions,
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 500, useNativeDriver: true }},
      close: { animation: 'timing', config: { duration: 500, useNativeDriver: true }}
    },
    // ... other slow animation settings
  };
```

#### Best Practices

1. **Choose appropriate animation type** based on app requirements
2. **Use theme integration** for consistent background colors
3. **Test on both platforms** to ensure smooth performance
4. **Consider accessibility** - instant navigation may be better for some users
5. **Profile performance** especially with complex screen transitions
6. **Maintain consistency** within each app (don't mix animation types)

**This navigation configuration system ensures consistent, performant, and theme-aware navigation across all boilerplate apps while providing flexibility for different user experience requirements.**

### RTL Utilities ✅
**Location**: `src/utils/rtl.ts`

```typescript
// Core RTL functions
isRTL(): boolean
forceRTL(enabled: boolean): void
getFlexDirection(isRTL: boolean): 'row' | 'row-reverse'
getTextAlign(isRTL: boolean): 'left' | 'right'

// Margin/Padding utilities
getRTLMargin(isRTL: boolean): {
  marginStart: (value: number) => object;
  marginEnd: (value: number) => object;
  marginLeft: (value: number) => object;
  marginRight: (value: number) => object;
}

getRTLPadding(isRTL: boolean): {
  paddingStart: (value: number) => object;
  paddingEnd: (value: number) => object;
  paddingLeft: (value: number) => object;
  paddingRight: (value: number) => object;
}

// Style transformation
createRTLStyle(style: ViewStyle, rtlStyle: ViewStyle, isRTL: boolean): ViewStyle
transformRTLStyle(style: ViewStyle, isRTL: boolean): ViewStyle

// Icon handling
getIconDirection(iconName: string, isRTL: boolean): string
getRTLIconName(iconName: IconName, isRTL: boolean): IconName
```

### Other Utilities ✅

#### ValidationUtils
**Location**: `src/utils/validation.ts`
Form validation helpers for email, phone, password strength, etc.

#### FormatUtils  
**Location**: `src/utils/format.ts`
Data formatting for dates, currency, phone numbers, file sizes.

#### DeviceUtils
**Location**: `src/utils/helpers.ts`
Device information, capabilities, and platform detection.

### Custom Hooks ✅

#### useAsync
**Location**: `src/hooks/useAsync.ts`
```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useAsync<T>(asyncFunction: () => Promise<T>, deps?: any[]): AsyncState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
}
```

#### useDebounce
**Location**: `src/hooks/useDebounce.ts`
```typescript
function useDebounce<T>(value: T, delay: number): T
function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number): T
```

#### useStorage
**Location**: `src/hooks/useStorage.ts`
```typescript
function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean]
```

#### useKeyboard
**Location**: `src/hooks/useKeyboard.ts`
```typescript
interface KeyboardState {
  isVisible: boolean;
  height: number;
}

function useKeyboard(): KeyboardState
```

#### useOrientation
**Location**: `src/hooks/useOrientation.ts`
```typescript
type Orientation = 'portrait' | 'landscape'

function useOrientation(): {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
  dimensions: { width: number; height: number };
}
```

---

## 🎯 Usage Guidelines

### Before Creating New Components

1. **Check this documentation first** - Component might already exist
2. **Search in `src/components`** - Look for similar functionality  
3. **Consider extending existing** - Add props/variants to existing components
4. **Follow existing patterns** - Use same prop naming and structure

### Component Development Patterns

**Props Interface Naming:**
```typescript
// ✅ Good - matches component name
interface ButtonProps { }
interface CardProps { }
interface TextInputProps { }

// ❌ Bad - inconsistent naming
interface IButtonProperties { }
interface CardConfiguration { }
```

**Variant and Size Props:**
```typescript
// ✅ Good - consistent pattern
variant?: 'primary' | 'secondary' | 'outline';
size?: 'small' | 'medium' | 'large';

// ❌ Bad - inconsistent types
type?: string;
buttonSize?: number;
```

**RTL Development:**
- All components support RTL automatically
- Use provided RTL utilities for custom components
- Test with RTL languages (Arabic, Hebrew)
- Use `enableRTL` prop for opt-in RTL behavior

**Theme Integration:**
- Always use `useTheme()` hook for colors/spacing
- Support both light and dark modes
- Use theme color variables, not hardcoded colors
- Follow theme size scale for consistent spacing

**TypeScript Best Practices:**
- Extend existing interfaces when possible
- Export all prop interfaces for reusability
- Use union types for variants and sizes
- Provide default values for optional props

---

## 📚 Import Patterns

```typescript
// UI Components
import { Button, Text, Card, List, Avatar, Modal, Checkbox, CountdownTimer } from '@/components/ui';

// Form Components
import { TextInput, OTPInput, Select, MaskedTextInput, SimpleDatePicker } from '@/components/forms';

// Layout Components
import { Container, KeyboardAvoidingContainer } from '@/components/layout';

// Navigation Components
import { Header, BackButton, BottomTabNavigator } from '@/components/navigation';

// Navigation Configuration
import { 
  createNavigationOptions,
  createInstantNavigationOptions,
  createFastNavigationOptions,
  createDefaultNavigationOptions
} from '@/config/navigationConfig';

// Screens
import { AuthScreen, SettingsScreen, OnboardingScreen } from '@/screens';

// Contexts
import { useTheme, useAuth, useRTL } from '@/contexts';

// Services
import { StorageService, AuthService } from '@/services';

// Utilities
import { ValidationUtils, FormatUtils, isRTL, getRTLMargin } from '@/utils';

// Hooks
import { useAsync, useDebounce, useStorage, useKeyboard } from '@/hooks';
```

---

## 🔍 Component Status Summary

| Component Category | Total Available | All Props Documented | RTL Support | Theme Integration |
|-------------------|----------------|---------------------|-------------|------------------|
| **UI Components** | 24 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Form Components** | 5 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Layout Components** | 2 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Navigation Components** | 5 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Screens** | 4 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Contexts** | 6 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Services** | 5 | ✅ Complete | N/A | ✅ Yes |
| **Utilities** | 8+ | ✅ Complete | ✅ RTL Core | ✅ Yes |
| **Custom Hooks** | 5 | ✅ Complete | ✅ Yes | ✅ Yes |
| **Navigation Config** | 1 | ✅ Complete | ✅ Yes | ✅ Yes |

**Total: 62+ ready-to-use components and utilities**

---

## 🚀 Quick Reference Checklist

**Before coding any UI element:**

- [ ] Check if component exists in this documentation
- [ ] Review all available props and variants
- [ ] Copy example usage code
- [ ] Test RTL behavior if applicable
- [ ] Verify theme integration
- [ ] Consider accessibility requirements

**This comprehensive reference ensures zero code duplication and consistent implementation patterns across your entire application.**