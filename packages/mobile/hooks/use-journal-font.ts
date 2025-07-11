/**
 * Journal Font Hook
 * 
 * Provides font family selection based on text content language detection
 * and theme context for journal writing experiences.
 */

import { Platform } from 'react-native';
import { useTheme } from './use-theme';

type JournalFontType = 'japanese' | 'english' | 'system';

function detectLanguage(text: string): JournalFontType {
  if (!text) return 'system';
  
  // Simple Japanese character detection
  // Matches Hiragana, Katakana, and common Kanji ranges
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
  
  if (japaneseRegex.test(text)) {
    return 'japanese';
  }
  
  // Default to English for Latin characters
  const englishRegex = /[a-zA-Z]/;
  if (englishRegex.test(text)) {
    return 'english';
  }
  
  return 'system';
}

function getFontFamily(type: JournalFontType, journalFonts: any): string {
  const platformFonts = {
    japanese: Platform.select({
      ios: 'Hiragino Sans',
      android: 'Noto Sans CJK JP',
      default: journalFonts.japanese,
    }),
    english: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
      default: journalFonts.english,
    }),
    system: journalFonts.system,
  };

  return platformFonts[type] || journalFonts.system;
}

export function useJournalFont(text?: string) {
  const { theme } = useTheme();
  const journalFonts = theme.typography.journal;
  
  const detectedType = text ? detectLanguage(text) : 'system';
  const fontFamily = getFontFamily(detectedType, journalFonts);
  
  return {
    fontFamily,
    detectedLanguage: detectedType,
    // Pre-defined font families for manual selection
    fonts: {
      japanese: getFontFamily('japanese', journalFonts),
      english: getFontFamily('english', journalFonts),
      system: getFontFamily('system', journalFonts),
    },
  };
}