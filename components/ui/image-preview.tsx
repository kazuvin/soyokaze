import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BorderRadius } from '@/constants/design-tokens';

type ImagePreviewProps = {
  images: string[];
  onRemoveImage?: (index: number) => void;
  editable?: boolean;
};

export function ImagePreview({ images, onRemoveImage, editable = false }: ImagePreviewProps) {
  const { theme } = useTheme();

  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
          />
          {editable && onRemoveImage && (
            <TouchableOpacity
              style={[
                styles.removeButton,
                { backgroundColor: theme.semantic.critical }
              ]}
              onPress={() => onRemoveImage(index)}
            >
              <Ionicons
                name="close"
                size={16}
                color={theme.text.onColor}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});