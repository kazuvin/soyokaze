import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WeeklyCalendar } from '@/features/journal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';

type JournalEntry = {
  id: string;
  date: Date;
  content: string;
  createdAt: Date;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      content: '今日は天気が良くて、散歩に出かけました。桜がとても綺麗で、気持ちの良い一日でした。',
      createdAt: new Date(),
    },
    {
      id: '2',
      date: new Date(2024, 11, 15),
      content: '新しいプロジェクトが始まりました。チームのメンバーと初めての打ち合わせがあり、これからが楽しみです。',
      createdAt: new Date(2024, 11, 15),
    },
    {
      id: '3',
      date: new Date(2024, 11, 20),
      content: '読書の時間を増やしたいと思います。最近忙しくて本を読む時間が取れていませんでした。',
      createdAt: new Date(2024, 11, 20),
    },
  ]);

  const mockJournalDates = journalEntries.map(entry => entry.date);

  const handleDateClick = (date: Date) => {
    console.log('クリックされた日付:', date.toLocaleDateString('ja-JP'));
  };

  const handleCreateJournal = () => {
    if (journalText.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: journalText.trim(),
        createdAt: new Date(),
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setJournalText('');
      setIsDialogOpen(false);
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
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>今週のカレンダー</ThemedText>
          <WeeklyCalendar
            onDateClick={handleDateClick}
            journalDates={mockJournalDates}
          />
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>ジャーナル</ThemedText>
          {journalEntries.map((entry) => (
            <Card key={entry.id} variant="elevated" style={styles.journalCard}>
              <CardContent>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[styles.journalDate, { color: theme.text.secondary }]}
                >
                  {formatDate(entry.date)}
                </ThemedText>
                <ThemedText style={styles.journalContent}>
                  {entry.content}
                </ThemedText>
              </CardContent>
            </Card>
          ))}
        </ThemedView>
      </ScrollView>

      <Button
        icon="plus"
        iconOnly
        variant="primary"
        size="large"
        style={[styles.fab, { backgroundColor: theme.brand.primary }]}
        onPress={() => setIsDialogOpen(true)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} variant="slide">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいジャーナルを作成</DialogTitle>
            <DialogClose />
          </DialogHeader>
          
          <View style={styles.dialogContent}>
            <Textarea
              variant="borderless"
              placeholder="今日はどんな一日でしたか？"
              value={journalText}
              onChangeText={setJournalText}
              rows={8}
              fullWidth
              style={styles.textArea}
            />
            
            <View style={styles.characterCount}>
              <ThemedText 
                style={[styles.characterCountText, { color: theme.text.secondary }]}
              >
                {journalText.length} 文字
              </ThemedText>
            </View>
            
            <Button
              title="作成"
              variant="primary"
              fullWidth
              onPress={handleCreateJournal}
              disabled={!journalText.trim()}
              style={styles.createButton}
            />
          </View>
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
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: 100, // FABのスペースを確保
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    marginBottom: Spacing[4],
  },
  journalCard: {
    marginBottom: Spacing[3],
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
    bottom: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
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
  textArea: {
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
    marginTop: 'auto',
  },
});
