import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { TypographyStyles } from '@/constants/styles';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodySmall' | 'label' | 'caption' | 'code';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Get style based on type
  const getTypeStyle = () => {
    switch (type) {
      case 'h1':
        return TypographyStyles.h1;
      case 'h2':
        return TypographyStyles.h2;
      case 'h3':
        return TypographyStyles.h3;
      case 'h4':
        return TypographyStyles.h4;
      case 'h5':
        return TypographyStyles.h5;
      case 'h6':
        return TypographyStyles.h6;
      case 'title':
        return TypographyStyles.h2; // Backward compatibility
      case 'subtitle':
        return TypographyStyles.h4; // Backward compatibility
      case 'bodyLarge':
        return TypographyStyles.bodyLarge;
      case 'body':
        return TypographyStyles.body;
      case 'bodySmall':
        return TypographyStyles.bodySmall;
      case 'defaultSemiBold':
        return { ...TypographyStyles.body, fontWeight: '600' as const }; // Backward compatibility
      case 'label':
        return TypographyStyles.label;
      case 'caption':
        return TypographyStyles.caption;
      case 'link':
        return TypographyStyles.link;
      case 'code':
        return TypographyStyles.code;
      case 'default':
      default:
        return TypographyStyles.body;
    }
  };

  return (
    <Text
      style={[
        { color },
        getTypeStyle(),
        style,
      ]}
      {...rest}
    />
  );
}
