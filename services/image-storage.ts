import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const IMAGES_DIR = `${FileSystem.documentDirectory}journal_images/`;

export async function initializeImageStorage(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
      console.log('Journal images directory created');
    }
  } catch (error) {
    console.error('Failed to initialize image storage:', error);
  }
}

export async function saveImageToLocal(imageUri: string): Promise<string | null> {
  try {
    console.log('saveImageToLocal - Input URI:', imageUri);
    
    // ディレクトリの初期化を確実に行う
    await initializeImageStorage();
    
    // 元の画像ファイルが存在するか確認
    const sourceInfo = await FileSystem.getInfoAsync(imageUri);
    console.log('Source file info:', sourceInfo);
    
    if (!sourceInfo.exists) {
      console.error('Source image does not exist:', imageUri);
      Alert.alert('エラー', '画像ファイルが見つかりません');
      return null;
    }
    
    // ユニークなファイル名を生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `journal_${timestamp}_${randomSuffix}.jpg`;
    const localUri = `${IMAGES_DIR}${fileName}`;
    
    console.log('Copying from:', imageUri);
    console.log('Copying to:', localUri);
    
    // 画像を永続的なローカルストレージにコピー
    await FileSystem.copyAsync({
      from: imageUri,
      to: localUri,
    });
    
    // コピー後のファイルが存在するか確認
    const savedInfo = await FileSystem.getInfoAsync(localUri);
    console.log('Saved file info:', savedInfo);
    
    if (savedInfo.exists) {
      console.log('Image saved successfully to:', localUri);
      return localUri;
    } else {
      console.error('Failed to save image - file does not exist after copy');
      return null;
    }
  } catch (error) {
    console.error('Failed to save image:', error);
    Alert.alert('エラー', '画像の保存に失敗しました');
    return null;
  }
}

export async function saveMultipleImages(imageUris: string[]): Promise<string[]> {
  const savedImages: string[] = [];
  
  for (const uri of imageUris) {
    const savedUri = await saveImageToLocal(uri);
    if (savedUri) {
      savedImages.push(savedUri);
    }
  }
  
  return savedImages;
}

export async function deleteImage(imageUri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri);
      console.log('Image deleted:', imageUri);
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}

export async function deleteMultipleImages(imageUris: string[]): Promise<void> {
  for (const uri of imageUris) {
    await deleteImage(uri);
  }
}

export async function getImageInfo(imageUri: string): Promise<FileSystem.FileInfo | null> {
  try {
    return await FileSystem.getInfoAsync(imageUri);
  } catch (error) {
    console.error('Failed to get image info:', error);
    return null;
  }
}

export function isLocalImage(uri: string): boolean {
  return uri.startsWith(IMAGES_DIR);
}

export async function cleanupOrphanedImages(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
      return;
    }
    
    const files = await FileSystem.readDirectoryAsync(IMAGES_DIR);
    console.log(`Found ${files.length} image files in storage`);
    
    // TODO: データベースから参照されていない画像ファイルを削除する機能
    // これは将来的にバックグラウンドタスクとして実装することを推奨
  } catch (error) {
    console.error('Failed to cleanup orphaned images:', error);
  }
}