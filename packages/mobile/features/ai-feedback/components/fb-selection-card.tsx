import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';

export type AIFeedbackOption = {
  id: string;
  name: string;
  description: string;
  illustration: string; // 将来的にアイコンやイラストのパスを格納
};

export type FBSelectionCardProps = {
  options: AIFeedbackOption[];
  selectedOption?: string;
  onSelect: (optionId: string) => void;
};

export function FBSelectionCard({ options, selectedOption, onSelect }: FBSelectionCardProps) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: Spacing[4] }}>
      <ThemedText 
        style={{ 
          fontSize: 14, 
          fontWeight: '600',
          marginBottom: Spacing[3],
          paddingHorizontal: Spacing[1],
          color: theme.text.secondary,
        }}
      >
        AIからのフィードバックを選択
      </ThemedText>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[1] }}
      >
        {options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                width: 120,
                marginRight: index < options.length - 1 ? Spacing[3] : 0,
                padding: Spacing[3],
                borderRadius: 16,
                backgroundColor: isSelected ? theme.brand.primary + '20' : theme.background.secondary,
                borderWidth: isSelected ? 1 : 0,
                borderColor: isSelected ? theme.brand.primary : 'transparent',
              }}
            >
              {/* イラスト部分（将来的にアイコンに置き換え） */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.brand.primary + '30',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing[2],
                alignSelf: 'center',
              }}>
                <ThemedText style={{ fontSize: 18 }}>
                  {option.illustration}
                </ThemedText>
              </View>
              
              {/* AI名 */}
              <ThemedText style={{
                fontSize: 12,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: Spacing[1],
                color: theme.text.primary,
              }}>
                {option.name}
              </ThemedText>
              
              {/* 説明 */}
              <ThemedText style={{
                fontSize: 10,
                textAlign: 'center',
                lineHeight: 14,
                color: theme.text.secondary,
              }}>
                {option.description}
              </ThemedText>
              
              {/* 選択ラベル */}
              {isSelected && (
                <View style={{
                  marginTop: Spacing[2],
                  paddingVertical: 2,
                  paddingHorizontal: Spacing[2],
                  backgroundColor: theme.brand.primary + '40',
                  borderRadius: 8,
                  alignSelf: 'center',
                }}>
                  <ThemedText style={{
                    fontSize: 9,
                    fontWeight: '500',
                    color: theme.brand.primary,
                  }}>
                    選択中
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}