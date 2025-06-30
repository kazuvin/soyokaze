import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ColorPalette } from '@/constants/design-tokens';

type ImageModalProps = {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function ImageModal({ visible, imageUri, onClose }: ImageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons
            name="close"
            size={28}
            color={ColorPalette.neutral[50]}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={1}
          onPress={onClose}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="contain"
          />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
  },
});