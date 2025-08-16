import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '@/utils/logger';

// Try to import other icon families, but handle if they're not available
let MaterialIcons: any, MaterialCommunityIcons: any, FontAwesome: any;
let FontAwesome5: any, FontAwesome6: any, AntDesign: any;
let Entypo: any, EvilIcons: any, Feather: any;
let Foundation: any, Octicons: any, SimpleLineIcons: any, Zocial: any;

try {
  const VectorIcons = require('@expo/vector-icons');
  MaterialIcons = VectorIcons.MaterialIcons;
  MaterialCommunityIcons = VectorIcons.MaterialCommunityIcons;
  FontAwesome = VectorIcons.FontAwesome;
  FontAwesome5 = VectorIcons.FontAwesome5;
  FontAwesome6 = VectorIcons.FontAwesome6;
  AntDesign = VectorIcons.AntDesign;
  Entypo = VectorIcons.Entypo;
  EvilIcons = VectorIcons.EvilIcons;
  Feather = VectorIcons.Feather;
  Foundation = VectorIcons.Foundation;
  Octicons = VectorIcons.Octicons;
  SimpleLineIcons = VectorIcons.SimpleLineIcons;
  Zocial = VectorIcons.Zocial;
} catch (error) {
  logger.warn('Some icon families are not available:', error, { function: 'iconFamilyLoad', component: 'EnhancedIcon' });
}
import { useTheme } from '@/contexts/ThemeContext';

export type IconFamily = 
  | 'Ionicons'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export type IconName = 
  | keyof typeof Ionicons.glyphMap
  | keyof typeof MaterialIcons.glyphMap
  | keyof typeof MaterialCommunityIcons.glyphMap
  | keyof typeof FontAwesome.glyphMap
  | keyof typeof FontAwesome5.glyphMap
  | keyof typeof FontAwesome6.glyphMap
  | keyof typeof AntDesign.glyphMap
  | keyof typeof Entypo.glyphMap
  | keyof typeof EvilIcons.glyphMap
  | keyof typeof Feather.glyphMap
  | keyof typeof Foundation.glyphMap
  | keyof typeof Octicons.glyphMap
  | keyof typeof SimpleLineIcons.glyphMap
  | keyof typeof Zocial.glyphMap;

interface EnhancedIconProps {
  family: IconFamily;
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export function EnhancedIcon({ family, name, size = 24, color, style }: EnhancedIconProps) {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;

  const iconComponents = {
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    Foundation,
    Octicons,
    SimpleLineIcons,
    Zocial,
  };

  const IconComponent = iconComponents[family];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      name={name as any}
      size={size}
      color={iconColor}
      style={style}
    />
  );
}

// Helper function to get all available icons for a specific family
export const getIconsForFamily = (family: IconFamily): string[] => {
  const iconMaps: { [key: string]: any } = {};
  
  // Only add families that are available
  if (Ionicons?.glyphMap) iconMaps.Ionicons = Ionicons.glyphMap;
  if (MaterialIcons?.glyphMap) iconMaps.MaterialIcons = MaterialIcons.glyphMap;
  if (MaterialCommunityIcons?.glyphMap) iconMaps.MaterialCommunityIcons = MaterialCommunityIcons.glyphMap;
  if (FontAwesome?.glyphMap) iconMaps.FontAwesome = FontAwesome.glyphMap;
  if (FontAwesome5?.glyphMap) iconMaps.FontAwesome5 = FontAwesome5.glyphMap;
  if (FontAwesome6?.glyphMap) iconMaps.FontAwesome6 = FontAwesome6.glyphMap;
  if (AntDesign?.glyphMap) iconMaps.AntDesign = AntDesign.glyphMap;
  if (Entypo?.glyphMap) iconMaps.Entypo = Entypo.glyphMap;
  if (EvilIcons?.glyphMap) iconMaps.EvilIcons = EvilIcons.glyphMap;
  if (Feather?.glyphMap) iconMaps.Feather = Feather.glyphMap;
  if (Foundation?.glyphMap) iconMaps.Foundation = Foundation.glyphMap;
  if (Octicons?.glyphMap) iconMaps.Octicons = Octicons.glyphMap;
  if (SimpleLineIcons?.glyphMap) iconMaps.SimpleLineIcons = SimpleLineIcons.glyphMap;
  if (Zocial?.glyphMap) iconMaps.Zocial = Zocial.glyphMap;

  return Object.keys(iconMaps[family] || {});
};

// Get icon family descriptions
export const getIconFamilyInfo = () => {
  const familyInfo: { [key: string]: any } = {};

  if (Ionicons?.glyphMap) {
    familyInfo.Ionicons = {
      name: 'Ionicons',
      description: 'Premium designed icons for use in web, iOS, Android, and desktop apps',
      website: 'https://ionic.io/ionicons',
      count: Object.keys(Ionicons.glyphMap).length,
    };
  }

  if (MaterialIcons?.glyphMap) {
    familyInfo.MaterialIcons = {
      name: 'Material Icons',
      description: 'Google\'s official icon set based on Material Design',
      website: 'https://material.io/icons',
      count: Object.keys(MaterialIcons.glyphMap).length,
    };
  }

  if (MaterialCommunityIcons?.glyphMap) {
    familyInfo.MaterialCommunityIcons = {
      name: 'Material Community Icons',
      description: 'Community-driven Material Design icon pack',
      website: 'https://materialdesignicons.com',
      count: Object.keys(MaterialCommunityIcons.glyphMap).length,
    };
  }

  if (FontAwesome?.glyphMap) {
    familyInfo.FontAwesome = {
      name: 'FontAwesome 4',
      description: 'The web\'s most popular icon toolkit (version 4)',
      website: 'https://fontawesome.com',
      count: Object.keys(FontAwesome.glyphMap).length,
    };
  }

  if (FontAwesome5?.glyphMap) {
    familyInfo.FontAwesome5 = {
      name: 'FontAwesome 5',
      description: 'FontAwesome version 5 with solid, regular, and brand styles',
      website: 'https://fontawesome.com',
      count: Object.keys(FontAwesome5.glyphMap).length,
    };
  }

  if (FontAwesome6?.glyphMap) {
    familyInfo.FontAwesome6 = {
      name: 'FontAwesome 6',
      description: 'Latest FontAwesome with updated icons and styles',
      website: 'https://fontawesome.com',
      count: Object.keys(FontAwesome6.glyphMap).length,
    };
  }

  if (AntDesign?.glyphMap) {
    familyInfo.AntDesign = {
      name: 'Ant Design Icons',
      description: 'Enterprise-class UI design language icons',
      website: 'https://ant.design/components/icon',
      count: Object.keys(AntDesign.glyphMap).length,
    };
  }

  if (Entypo?.glyphMap) {
    familyInfo.Entypo = {
      name: 'Entypo',
      description: '411 carefully crafted premium pictograms',
      website: 'http://www.entypo.com',
      count: Object.keys(Entypo.glyphMap).length,
    };
  }

  if (EvilIcons?.glyphMap) {
    familyInfo.EvilIcons = {
      name: 'Evil Icons',
      description: 'Simple and clean SVG icon pack',
      website: 'https://evil-icons.io',
      count: Object.keys(EvilIcons.glyphMap).length,
    };
  }

  if (Feather?.glyphMap) {
    familyInfo.Feather = {
      name: 'Feather Icons',
      description: 'Simply beautiful open source icons',
      website: 'https://feathericons.com',
      count: Object.keys(Feather.glyphMap).length,
    };
  }

  if (Foundation?.glyphMap) {
    familyInfo.Foundation = {
      name: 'Foundation Icons',
      description: 'Foundation framework icon set',
      website: 'https://zurb.com/playground/foundation-icon-fonts-3',
      count: Object.keys(Foundation.glyphMap).length,
    };
  }

  if (Octicons?.glyphMap) {
    familyInfo.Octicons = {
      name: 'Octicons',
      description: 'GitHub\'s icon font',
      website: 'https://octicons.github.com',
      count: Object.keys(Octicons.glyphMap).length,
    };
  }

  if (SimpleLineIcons?.glyphMap) {
    familyInfo.SimpleLineIcons = {
      name: 'Simple Line Icons',
      description: 'Simple line styled icons',
      website: 'https://simplelineicons.github.io',
      count: Object.keys(SimpleLineIcons.glyphMap).length,
    };
  }

  if (Zocial?.glyphMap) {
    familyInfo.Zocial = {
      name: 'Zocial Icons',
      description: 'Social media icons',
      website: 'http://zocial.smcllns.com',
      count: Object.keys(Zocial.glyphMap).length,
    };
  }

  return familyInfo;
};

// Helper function to get available icon families
export const getAvailableIconFamilies = (): IconFamily[] => {
  const families: IconFamily[] = [];
  
  if (Ionicons?.glyphMap) families.push('Ionicons');
  if (MaterialIcons?.glyphMap) families.push('MaterialIcons');
  if (MaterialCommunityIcons?.glyphMap) families.push('MaterialCommunityIcons');
  if (FontAwesome?.glyphMap) families.push('FontAwesome');
  if (FontAwesome5?.glyphMap) families.push('FontAwesome5');
  if (FontAwesome6?.glyphMap) families.push('FontAwesome6');
  if (AntDesign?.glyphMap) families.push('AntDesign');
  if (Entypo?.glyphMap) families.push('Entypo');
  if (EvilIcons?.glyphMap) families.push('EvilIcons');
  if (Feather?.glyphMap) families.push('Feather');
  if (Foundation?.glyphMap) families.push('Foundation');
  if (Octicons?.glyphMap) families.push('Octicons');
  if (SimpleLineIcons?.glyphMap) families.push('SimpleLineIcons');
  if (Zocial?.glyphMap) families.push('Zocial');

  return families;
};