import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Spacing, BorderRadius, Typography, ColorPalette } from "@/constants/design-tokens";
import { useState } from "react";

export type CalendarProps = {
  onDateClick?: (date: Date) => void;
  journalDates?: Date[];
};

export function Calendar({ onDateClick, journalDates = [] }: CalendarProps) {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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

  const renderHeader = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing[4],
      marginBottom: Spacing[4],
    }}>
      <TouchableOpacity
        onPress={getPreviousMonth}
        style={{
          padding: Spacing[2],
          borderRadius: BorderRadius.base,
        }}
      >
        <ThemedText style={{
          fontSize: Typography.fontSize.lg,
          fontWeight: Typography.fontWeight.medium,
          color: theme.brand.primary,
        }}>
          ‹
        </ThemedText>
      </TouchableOpacity>
      
      <ThemedText style={{
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        color: theme.text.primary,
      }}>
        {currentMonth.toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'long' 
        })}
      </ThemedText>
      
      <TouchableOpacity
        onPress={getNextMonth}
        style={{
          padding: Spacing[2],
          borderRadius: BorderRadius.base,
        }}
      >
        <ThemedText style={{
          fontSize: Typography.fontSize.lg,
          fontWeight: Typography.fontWeight.medium,
          color: theme.brand.primary,
        }}>
          ›
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 前月の日付で空白を埋める
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    for (let i = 0; i < firstDay; i++) {
      const dayNumber = prevMonthDays - firstDay + i + 1;
      const prevMonthDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNumber);
      
      const hasJournalPrevEntry = hasJournal(prevMonthDate);
      
      days.push(
        <TouchableOpacity
          key={`prev-${dayNumber}`}
          onPress={() => {
            setCurrentMonth(prevMonth);
            onDateClick?.(prevMonthDate);
          }}
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
          <ThemedText style={{
            fontSize: Typography.fontSize.base,
            fontWeight: Typography.fontWeight.normal,
            color: theme.text.disabled,
          }}>
            {dayNumber}
          </ThemedText>
          
          {hasJournalPrevEntry && (
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
    }

    // 現在の月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isTodayDate = isToday(date);
      const hasJournalEntry = hasJournal(date);

      days.push(
        <TouchableOpacity
          key={day}
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
              {day}
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
    }

    // 次月の日付で最後の週を埋める
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= nextMonthDays; day++) {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      const nextMonthObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
      const hasJournalNextEntry = hasJournal(nextMonth);
      
      days.push(
        <TouchableOpacity
          key={`next-${day}`}
          onPress={() => {
            setCurrentMonth(nextMonthObj);
            onDateClick?.(nextMonth);
          }}
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
          <ThemedText style={{
            fontSize: Typography.fontSize.base,
            fontWeight: Typography.fontWeight.normal,
            color: theme.text.disabled,
          }}>
            {day}
          </ThemedText>
          
          {hasJournalNextEntry && (
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
    }

    // 週ごとに分ける
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <View
          key={`week-${i / 7}`}
          style={{
            flexDirection: 'row',
            paddingHorizontal: Spacing[2],
            marginBottom: Spacing[1],
          }}
        >
          {days.slice(i, i + 7)}
        </View>
      );
    }

    return weeks;
  };

  return (
    <ThemedView style={{
      borderRadius: BorderRadius.lg,
      padding: Spacing[4],
      backgroundColor: theme.background.primary,
      borderWidth: 1,
      borderColor: theme.border.primary,
    }}>
      {renderHeader()}
      {renderDayHeaders()}
      {renderCalendarDays()}
    </ThemedView>
  );
}