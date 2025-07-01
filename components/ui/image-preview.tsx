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

  // URIを正規化（ローカルファイルの場合file://プレフィックスを確認）
  const normalizeUri = (uri: string): string => {
    if (uri.startsWith('/') && !uri.startsWith('file://')) {
      // ローカルファイルパスにfile://プレフィックスを追加
      return `file://${uri}`;
    }
    return uri;
  };

  // デバッグ: 渡された画像URIをログ出力
  React.useEffect(() => {
    console.log('ImagePreview received images:', images);
    images.forEach((uri, index) => {
      const normalizedUri = normalizeUri(uri);
      console.log(`Image ${index}: ${uri} -> ${normalizedUri}`);
    });
  }, [images]);

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
        {images.map((uri, index) => {
          const normalizedUri = normalizeUri(uri);
          return (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity onPress={() => handleImagePress(normalizedUri)}>
                <Image
                  source={{ uri: normalizedUri }}
                  style={styles.image}
                  contentFit="cover"
                  onError={(error) => {
                    console.error(`Failed to load image ${normalizedUri}:`, error);
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: ${normalizedUri}`);
                  }}
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
          );
        })}
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