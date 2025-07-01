import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { JournalDetail } from '@/features/journal';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';
import type { JournalEntry } from '@/models/journal';
import { getJournalEntry } from '@/services/journal-service';

export default function JournalDetailScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntry = async () => {
      if (!id) {
        setError('ジャーナルIDが指定されていません。');
        setIsLoading(false);
        return;
      }

      const entryId = parseInt(id, 10);
      if (isNaN(entryId)) {
        setError('無効なジャーナルIDです。');
        setIsLoading(false);
        return;
      }

      try {
        const journalEntry = await getJournalEntry(entryId);
        setEntry(journalEntry);
      } catch (error) {
        console.error('Failed to load journal entry:', error);
        setError('ジャーナルエントリの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntry();
  }, [id]);

  const handleEntryUpdated = (updatedEntry: JournalEntry) => {
    setEntry(updatedEntry);
  };

  const handleEntryDeleted = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
      paddingTop: insets.top,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing[4],
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing[4],
    },
    errorText: {
      fontSize: 16,
      color: theme.text.error,
      textAlign: 'center',
      marginBottom: Spacing[4],
    },
    loadingText: {
      fontSize: 16,
      color: theme.text.secondary,
      marginTop: Spacing[4],
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
          <ThemedText style={styles.loadingText}>読み込み中...</ThemedText>
        </View>
      </View>
    );
  }

  if (error || !entry) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {error || 'ジャーナルエントリが見つかりません。'}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <JournalDetail
        entry={entry}
        onEntryUpdated={handleEntryUpdated}
        onEntryDeleted={handleEntryDeleted}
      />
    </View>
  );
}