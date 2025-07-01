import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ImagePreview } from '@/components/ui/image-preview';
import { useTheme } from '@/hooks/use-theme';
import { useJournalFont } from '@/hooks/use-journal-font';
import { Spacing, BorderRadius, Shadow } from '@/constants/design-tokens';
import type { JournalEntry, UpdateJournalEntry } from '@/models/journal';
import { updateJournalEntry, deleteJournalEntry } from '@/services/journal-service';

type JournalDetailProps = {
  entry: JournalEntry;
  onEntryUpdated?: (entry: JournalEntry) => void;
  onEntryDeleted?: () => void;
};

export function JournalDetail({ entry, onEntryUpdated, onEntryDeleted }: JournalDetailProps) {
  const { theme } = useTheme();
  const journalFont = useJournalFont(entry.content);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title);
  const [editContent, setEditContent] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleEdit = () => {
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert('エラー', 'タイトルと内容を入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: UpdateJournalEntry = {
        title: editTitle.trim(),
        content: editContent.trim(),
      };
      
      const updatedEntry = await updateJournalEntry(entry.id, updateData);
      onEntryUpdated?.(updatedEntry);
      setIsEditDialogOpen(false);
      Alert.alert('成功', 'ジャーナルを更新しました。');
    } catch (error) {
      console.error('Failed to update journal entry:', error);
      Alert.alert('エラー', 'ジャーナルの更新に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      'このジャーナルエントリを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteJournalEntry(entry.id);
              onEntryDeleted?.();
              router.back();
              Alert.alert('削除完了', 'ジャーナルエントリを削除しました。');
            } catch (error) {
              console.error('Failed to delete journal entry:', error);
              Alert.alert('エラー', 'ジャーナルエントリの削除に失敗しました。');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    scrollContent: {
      padding: Spacing[4],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing[6],
    },
    backButton: {
      padding: Spacing[2],
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: Spacing[2],
    },
    actionButton: {
      padding: Spacing[2],
    },
    dateContainer: {
      marginBottom: Spacing[4],
    },
    dateText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: Spacing[1],
    },
    timeText: {
      fontSize: 14,
      color: theme.text.secondary,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: Spacing[4],
    },
    contentContainer: {
      backgroundColor: theme.background.elevated,
      borderRadius: BorderRadius.lg,
      padding: Spacing[4],
      marginBottom: Spacing[4],
      ...Shadow.base,
    },
    contentText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text.primary,
      ...journalFont,
    },
    imagesContainer: {
      marginBottom: Spacing[4],
    },
    imagesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: Spacing[3],
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing[2],
    },
    imageItem: {
      width: '48%',
      aspectRatio: 1,
    },
    metadataContainer: {
      backgroundColor: theme.background.elevated,
      borderRadius: BorderRadius.lg,
      padding: Spacing[4],
      ...Shadow.base,
    },
    metadataTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: Spacing[2],
    },
    metadataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing[1],
    },
    metadataLabel: {
      fontSize: 14,
      color: theme.text.secondary,
    },
    metadataValue: {
      fontSize: 14,
      color: theme.text.primary,
    },
    dialogContent: {
      gap: Spacing[4],
    },
    dialogActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: Spacing[2],
      marginTop: Spacing[4],
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color={theme.text.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <ThemedText style={styles.dateText}>{formatDate(entry.date)}</ThemedText>
          <ThemedText style={styles.timeText}>作成時刻: {formatTime(entry.created_at)}</ThemedText>
        </View>

        <ThemedText style={styles.titleText}>{entry.title}</ThemedText>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.contentText}>{entry.content}</ThemedText>
        </View>

        {entry.images && entry.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <ThemedText style={styles.imagesTitle}>添付画像</ThemedText>
            <View style={styles.imagesGrid}>
              {entry.images.map((imageUri, index) => (
                <View key={index} style={styles.imageItem}>
                  <ImagePreview uri={imageUri} />
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.metadataContainer}>
          <ThemedText style={styles.metadataTitle}>詳細情報</ThemedText>
          <View style={styles.metadataRow}>
            <ThemedText style={styles.metadataLabel}>作成日時</ThemedText>
            <ThemedText style={styles.metadataValue}>
              {formatDate(entry.created_at)} {formatTime(entry.created_at)}
            </ThemedText>
          </View>
          <View style={styles.metadataRow}>
            <ThemedText style={styles.metadataLabel}>更新日時</ThemedText>
            <ThemedText style={styles.metadataValue}>
              {formatDate(entry.updated_at)} {formatTime(entry.updated_at)}
            </ThemedText>
          </View>
          <View style={styles.metadataRow}>
            <ThemedText style={styles.metadataLabel}>文字数</ThemedText>
            <ThemedText style={styles.metadataValue}>{entry.content.length}文字</ThemedText>
          </View>
        </View>
      </ScrollView>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ジャーナルを編集</DialogTitle>
          </DialogHeader>
          <View style={styles.dialogContent}>
            <Textarea
              placeholder="タイトルを入力..."
              value={editTitle}
              onChangeText={setEditTitle}
              maxLength={100}
            />
            <Textarea
              placeholder="内容を入力..."
              value={editContent}
              onChangeText={setEditContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={10000}
            />
            <View style={styles.dialogActions}>
              <Button
                variant="outline"
                onPress={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                onPress={handleSaveEdit}
                disabled={isLoading || !editTitle.trim() || !editContent.trim()}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}