import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/design-tokens';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  date: Date;
  createdAt: Date;
};

type SegmentDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: JournalEntry | null;
};

export function SegmentDetailDialog({ open, onOpenChange, segment }: SegmentDetailDialogProps) {
  const { theme } = useTheme();

  if (!segment) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="fullscreen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{segment.title}</DialogTitle>
        </DialogHeader>
        
        <View style={styles.content}>
          <Card variant="flat" style={styles.detailCard}>
            <CardHeader>
              <View style={styles.dateContainer}>
                <ThemedText 
                  type="subtitle" 
                  style={[styles.dateText, { color: theme.text.primary }]}
                >
                  {formatDate(segment.date)}
                </ThemedText>
                <ThemedText 
                  type="default" 
                  style={[styles.timeText, { color: theme.text.secondary }]}
                >
                  {formatTime(segment.createdAt)}
                </ThemedText>
              </View>
            </CardHeader>
            
            <CardContent>
              {segment.images && segment.images.length > 0 && (
                <View style={styles.imagesContainer}>
                  <ThemedText 
                    type="defaultSemiBold" 
                    style={[styles.sectionTitle, { color: theme.text.primary }]}
                  >
                    添付画像
                  </ThemedText>
                  <View style={styles.imageGrid}>
                    {segment.images.map((image, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.imagePlaceholder, 
                          { backgroundColor: theme.background.secondary }
                        ]}
                      >
                        <ThemedText 
                          type="caption" 
                          style={[styles.imageText, { color: theme.text.secondary }]}
                        >
                          画像 {index + 1}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.contentContainer}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[styles.sectionTitle, { color: theme.text.primary }]}
                >
                  内容
                </ThemedText>
                <ThemedText 
                  type="default" 
                  style={[styles.journalContent, { color: theme.text.primary }]}
                >
                  {segment.content}
                </ThemedText>
              </View>
            </CardContent>
          </Card>
        </View>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  detailCard: {
    marginBottom: Spacing[4],
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  timeText: {
    fontSize: 14,
  },
  imagesContainer: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: Spacing[3],
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  journalContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});