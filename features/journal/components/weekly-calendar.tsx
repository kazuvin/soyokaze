import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Spacing, BorderRadius, Typography, ColorPalette } from "@/constants/design-tokens";

export type WeeklyCalendarProps = {
  onDateClick?: (date: Date) => void;
  journalDates?: Date[];
};

export function WeeklyCalendar({ onDateClick, journalDates = [] }: WeeklyCalendarProps) {
  const { theme } = useTheme();

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasJournal = (date: Date) => {
    return journalDates.some(journalDate => 
      journalDate.toDateString() === date.toDateString()
    );
  };

  const renderWeekCalendar = () => {
    const weekDates = getWeekDates();
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

    return (
      <View style={{
        paddingHorizontal: Spacing[4],
      }}>
        {/* 曜日ヘッダー */}
        <View style={{
          flexDirection: 'row',
          marginBottom: 6,
        }}>
          {dayLabels.map((day, index) => (
            <View
              key={day}
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <ThemedText style={{
                fontSize: 12,
                fontWeight: Typography.fontWeight.medium,
                color: index === 0 ? ColorPalette.error[500] : 
                       index === 6 ? ColorPalette.primary[500] : 
                       theme.text.secondary,
              }}>
                {day}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* 日付 */}
        <View style={{
          flexDirection: 'row',
        }}>
          {weekDates.map((date, index) => {
            const isTodayDate = isToday(date);
            const hasJournalEntry = hasJournal(date);

            return (
              <View
                key={date.toDateString()}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => onDateClick?.(date)}
                  style={{
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: isTodayDate ? 16 : 0,
                    backgroundColor: isTodayDate ? theme.brand.primary : 'transparent',
                  }}
                >
                  <ThemedText style={{
                    fontSize: 14,
                    fontWeight: isTodayDate ? Typography.fontWeight.semibold : Typography.fontWeight.normal,
                    color: isTodayDate ? '#ffffff' : theme.text.primary,
                  }}>
                    {date.getDate()}
                  </ThemedText>
                </TouchableOpacity>
                
                {hasJournalEntry && (
                  <View style={{
                    marginTop: 2,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.brand.primary,
                  }} />
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={{
      backgroundColor: 'transparent',
      paddingVertical: Spacing[2],
    }}>
      {renderWeekCalendar()}
    </View>
  );
}