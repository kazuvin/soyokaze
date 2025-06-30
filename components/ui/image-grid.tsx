import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BorderRadius } from '@/constants/design-tokens';

type ImageGridProps = {
  images: string[];
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  readonly?: boolean;
};

export function ImageGrid({ images, onRemoveImage, maxImages = 4, readonly = false }: ImageGridProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = Spacing[6] * 2; // Dialog padding
  const imageGap = Spacing[2];
  const imagesPerRow = 2;
  const imageSize = (screenWidth - containerPadding - imageGap) / imagesPerRow;

  if (images.length === 0) {
    return null;
  }

  const renderImage = (uri: string, index: number) => (
    <View key={index} style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
      />
      {!readonly && (
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
  );

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap: imageGap }]}>
        {images.map((uri, index) => renderImage(uri, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
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
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});