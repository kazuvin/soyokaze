import { View } from 'react-native';
import { Spacing as SpacingTokens } from '@/constants/design-tokens';

type SpacingSize = keyof typeof SpacingTokens;

type SpacingProps = {
  size?: SpacingSize;
  horizontal?: boolean;
  vertical?: boolean;
};

export function Spacing({ size = 4, horizontal = false, vertical = false }: SpacingProps) {
  const spacingValue = SpacingTokens[size];
  
  return (
    <View
      style={{
        width: horizontal ? spacingValue : undefined,
        height: vertical ? spacingValue : undefined,
        flex: !horizontal && !vertical ? undefined : 0,
        minHeight: !horizontal && !vertical ? spacingValue : undefined,
      }}
    />
  );
}