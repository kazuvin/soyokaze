import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Spacing, BorderRadius } from '@/constants/design-tokens';
import { Button } from './button';
import { ImageModal } from './image-modal';

type ImagePreviewProps = {
  images: string[];
  onRemoveImage?: (index: number) => void;
  editable?: boolean;
  onImagePress?: (imageUri: string) => void;
};

export function ImagePreview({ images, onRemoveImage, editable = false, onImagePress }: ImagePreviewProps) {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  const handleImagePress = (uri: string) => {
    if (onImagePress) {
      onImagePress(uri);
    } else {
      setSelectedImageUri(uri);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <TouchableOpacity onPress={() => handleImagePress(uri)}>
              <Image
                source={{ uri }}
                style={styles.image}
                contentFit="cover"
              />
            </TouchableOpacity>
            {editable && onRemoveImage && (
              <Button
                variant="remove"
                size="xs"
                iconOnly
                icon="xmark"
                onPress={() => onRemoveImage(index)}
                style={styles.removeButton}
              />
            )}
          </View>
        ))}
      </View>
      
      {selectedImageUri && (
        <ImageModal
          visible={!!selectedImageUri}
          imageUri={selectedImageUri}
          onClose={() => setSelectedImageUri(null)}
        />
      )}
    </>
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
  },
});