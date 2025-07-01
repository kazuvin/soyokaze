import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { WeeklyCalendar } from '@/features/journal';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ImagePreview } from '@/components/ui/image-preview';
import { FBSelectionCard, type AIFeedbackOption } from '@/features/ai-feedback';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';
import { 
  createJournalEntry, 
  getAllJournalEntries, 
  getJournalEntriesByDate 
} from '@/services/journal-service';
import type { JournalEntry as DBJournalEntry } from '@/models/journal';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  date: Date;
  createdAt: Date;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [selectedAI, setSelectedAI] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const aiOptions: AIFeedbackOption[] = [
    {
      id: 'empathy',
      name: '共感AI',
      description: '気持ちに寄り添う',
      illustration: '💝',
    },
    {
      id: 'coach',
      name: 'コーチAI',
      description: '目標達成をサポート',
      illustration: '🎯',
    },
    {
      id: 'wise',
      name: '賢者AI',
      description: '深い洞察を提供',
      illustration: '🦉',
    },
    {
      id: 'cheerful',
      name: '応援AI',
      description: '元気づけてくれる',
      illustration: '🌟',
    },
  ];

  const journalDates = journalEntries.map(entry => entry.date);

  // データベースのジャーナルエントリをUI用の形式に変換
  const convertDBEntryToUIEntry = (dbEntry: DBJournalEntry): JournalEntry => ({
    id: dbEntry.id.toString(),
    title: dbEntry.title || '',
    content: dbEntry.content,
    date: new Date(dbEntry.entry_date),
    createdAt: new Date(dbEntry.created_at),
  });

  // ジャーナルエントリを読み込む
  const loadJournalEntries = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const dbEntries = await getAllJournalEntries();
      const uiEntries = dbEntries.map(convertDBEntryToUIEntry);
      setJournalEntries(uiEntries);
    } catch (error) {
      console.error('ジャーナルエントリの読み込みに失敗しました:', error);
      Alert.alert('エラー', 'ジャーナルエントリの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  const handleDateClick = async (date: Date) => {
    try {
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const entriesForDate = await getJournalEntriesByDate(dateString);
      
      if (entriesForDate.length > 0) {
        const uiEntries = entriesForDate.map(convertDBEntryToUIEntry);
        Alert.alert(
          `${date.toLocaleDateString('ja-JP')}のジャーナル`,
          `${uiEntries.length}件のエントリがあります`,
          [
            { text: 'OK', style: 'default' }
          ]
        );
      } else {
        Alert.alert(
          '該当なし',
          `${date.toLocaleDateString('ja-JP')}にはジャーナルエントリがありません`,
          [
            { text: 'OK', style: 'default' }
          ]
        );
      }
    } catch (error) {
      console.error('日付別ジャーナルエントリの取得に失敗しました:', error);
      Alert.alert('エラー', 'ジャーナルエントリの取得に失敗しました');
    }
  };

  const handleImagePick = async () => {
    if (selectedImages.length >= 4) {
      Alert.alert('最大枚数に達しました', '画像は最大4枚まで添付できます。');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('権限が必要です', '画像を選択するには写真ライブラリへのアクセス権限が必要です。');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateJournal = async () => {
    if (journalTitle.trim() && journalContent.trim()) {
      try {
        const today = new Date();
        const entryDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const newDBEntry = await createJournalEntry({
          title: journalTitle.trim(),
          content: journalContent.trim(),
          entry_date: entryDate,
        });

        const newUIEntry = convertDBEntryToUIEntry(newDBEntry);
        setJournalEntries(prev => [newUIEntry, ...prev]);
        
        setJournalTitle('');
        setJournalContent('');
        setSelectedImages([]);
        setSelectedAI('');
        setIsDialogOpen(false);
        
        Alert.alert('成功', 'ジャーナルエントリが作成されました');
      } catch (error) {
        console.error('ジャーナルエントリの作成に失敗しました:', error);
        Alert.alert('エラー', 'ジャーナルエントリの作成に失敗しました');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background.default }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + Spacing[4], paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, styles.calendarSection, { backgroundColor: 'transparent' }]}>
          <ThemedText type="subtitle" style={styles.greetingMessage}>
            こんにちは！今日も素敵な一日を過ごしましょう
          </ThemedText>
          <WeeklyCalendar
            onDateClick={handleDateClick}
            journalDates={journalDates}
          />
        </View>
        
        <View style={[styles.section, styles.journalSection, { backgroundColor: 'transparent' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>ジャーナル</ThemedText>
          {isLoading ? (
            <ThemedText style={{ textAlign: 'center', marginTop: Spacing[4] }}>
              読み込み中...
            </ThemedText>
          ) : journalEntries.length === 0 ? (
            <ThemedText style={{ textAlign: 'center', marginTop: Spacing[4] }}>
              まだジャーナルエントリがありません
            </ThemedText>
          ) : (
            journalEntries.map((entry) => (
              <Card key={entry.id} variant="flat" style={styles.journalCard}>
                <CardHeader>
                  <CardTitle>{entry.title}</CardTitle>
                </CardHeader>
                <CardContent style={styles.journalCardContent}>
                  {entry.images && entry.images.length > 0 && (
                    <ImagePreview images={entry.images} />
                  )}
                  <ThemedText style={styles.journalContent}>
                    {entry.content}
                  </ThemedText>
                </CardContent>
                <CardFooter>
                  <ThemedText 
                    type="defaultSemiBold" 
                    style={[styles.journalDate, { color: theme.text.secondary }]}
                  >
                    {formatDate(entry.date)}
                  </ThemedText>
                </CardFooter>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <Button
        icon="plus"
        iconOnly
        variant="primary"
        size="large"
        style={[
          styles.fab, 
          { 
            backgroundColor: theme.brand.primary,
            bottom: insets.bottom + 70, // タブバーの高さ + 余白を考慮（さらに下に移動）
            borderRadius: 16, // 角丸の四角
            aspectRatio: 1, // アスペクト比1:1を強制
          }
        ]}
        onPress={() => setIsDialogOpen(true)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいジャーナルを作成</DialogTitle>
          </DialogHeader>
          
          <KeyboardAvoidingView 
            style={styles.dialogContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={{ paddingHorizontal: Spacing[6] }}>
              <ImagePreview
                images={selectedImages}
                onRemoveImage={handleRemoveImage}
                editable={true}
              />
              
              <Textarea
                variant="borderless"
                placeholder="タイトルを入力してください"
                value={journalTitle}
                onChangeText={setJournalTitle}
                rows={1}
                fullWidth
                style={styles.titleInput}
              />
              
              <Textarea
                variant="borderless"
                placeholder="今日はどんな一日でしたか？"
                value={journalContent}
                onChangeText={setJournalContent}
                rows={6}
                fullWidth
                style={styles.contentInput}
              />
              
              <View style={styles.characterCount}>
                <ThemedText 
                  style={[styles.characterCountText, { color: theme.text.secondary }]}
                >
                  {journalContent.length} 文字
                </ThemedText>
              </View>
              
              <View style={styles.imageButtonContainer}>
                <Button
                  title="画像を追加"
                  variant="secondary"
                  onPress={handleImagePick}
                  disabled={selectedImages.length >= 4}
                  icon="photo"
                  style={styles.imageButton}
                />
              </View>
              
              <FBSelectionCard
                options={aiOptions}
                selectedOption={selectedAI}
                onSelect={setSelectedAI}
              />
            </View>
            
            <View style={{ paddingHorizontal: Spacing[6] }}>
              <Button
                title="作成"
                variant="primary"
                fullWidth
                onPress={handleCreateJournal}
                disabled={!journalTitle.trim() || !journalContent.trim()}
                style={styles.createButton}
              />
            </View>
          </KeyboardAvoidingView>
        </DialogContent>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    marginBottom: Spacing[4],
  },
  greetingMessage: {
    marginBottom: Spacing[4],
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
  },
  calendarSection: {
    paddingHorizontal: 0,
  },
  journalSection: {
    paddingHorizontal: Spacing[4],
  },
  journalCard: {
    marginBottom: Spacing[3],
  },
  journalCardContent: {
    paddingBottom: 0,
  },
  journalDate: {
    marginBottom: Spacing[2],
  },
  journalContent: {
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: Spacing[4],
    width: 56,
    height: 56,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  dialogContent: {
    flex: 1,
    paddingTop: Spacing[4],
  },
  dialogScrollView: {
    flex: 1,
  },
  titleInput: {
    marginBottom: Spacing[3],
    fontSize: 18,
    fontWeight: '600',
  },
  contentInput: {
    flex: 1,
    marginBottom: Spacing[4],
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: Spacing[4],
  },
  characterCountText: {
    fontSize: 14,
  },
  createButton: {
    marginTop: Spacing[4],
  },
  imageButtonContainer: {
    marginBottom: Spacing[4],
  },
  imageButton: {
    alignSelf: 'flex-start',
  },
});
