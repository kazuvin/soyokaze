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

  const renderDayHeaders = () => (
    <View style={{
      flexDirection: 'row',
      paddingHorizontal: Spacing[2],
      marginBottom: Spacing[2],
    }}>
      {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
        <View
          key={day}
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <ThemedText style={{
            fontSize: Typography.fontSize.sm,
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
  );

  const renderWeekDays = () => {
    const weekDates = getWeekDates();

    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: Spacing[2],
        }}
      >
        {weekDates.map((date, index) => {
          const isTodayDate = isToday(date);
          const hasJournalEntry = hasJournal(date);

          return (
            <TouchableOpacity
              key={date.toDateString()}
              onPress={() => onDateClick?.(date)}
              style={{
                flex: 1,
                aspectRatio: 0.8,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: BorderRadius.base,
                backgroundColor: 'transparent',
                position: 'relative',
                paddingBottom: Spacing[2],
              }}
            >
              <View style={{
                width: isTodayDate ? 32 : 'auto',
                height: isTodayDate ? 32 : 'auto',
                borderRadius: isTodayDate ? BorderRadius.lg : 0,
                backgroundColor: isTodayDate ? theme.brand.primary : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ThemedText style={{
                  fontSize: Typography.fontSize.base,
                  fontWeight: isTodayDate ? Typography.fontWeight.semibold : Typography.fontWeight.normal,
                  color: isTodayDate ? '#ffffff' : theme.text.primary,
                }}>
                  {date.getDate()}
                </ThemedText>
              </View>
              
              {hasJournalEntry && (
                <View style={{
                  position: 'absolute',
                  bottom: Spacing[1],
                  width: Spacing[1],
                  height: Spacing[1],
                  borderRadius: BorderRadius.full,
                  backgroundColor: theme.brand.primary,
                }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ThemedView style={{
      borderRadius: BorderRadius.lg,
      padding: Spacing[4],
      backgroundColor: theme.background.primary,
      borderWidth: 1,
      borderColor: theme.border.primary,
    }}>
      {renderDayHeaders()}
      {renderWeekDays()}
    </ThemedView>
  );
}