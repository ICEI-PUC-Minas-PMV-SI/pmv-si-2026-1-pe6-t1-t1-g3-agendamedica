import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius, typography } from '@/lib/tokens';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

interface Props {
  selectedDate: string | null;
  minDate?: string;
  onSelectDate: (date: string) => void;
}

export function MonthCalendar({ selectedDate, minDate, onSelectDate }: Props) {
  const min = minDate ?? todayStr();
  const minD = new Date(`${min}T12:00:00`);

  const [viewYear, setViewYear] = useState(() => {
    const d = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
    return d.getMonth();
  });

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const today = todayStr();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={prev}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
        <TouchableOpacity style={styles.navBtn} onPress={next}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map(d => <Text key={d} style={styles.weekday}>{d}</Text>)}
      </View>
      <View style={styles.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`e-${idx}`} style={styles.cell} />;
          const ds = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const disabled = new Date(`${ds}T12:00:00`) < minD;
          const selected = ds === selectedDate;
          const isToday = ds === today;
          return (
            <TouchableOpacity key={ds} style={[styles.cell, isToday && !selected && styles.cellToday, selected && styles.cellSelected, disabled && styles.cellDisabled]}
              onPress={() => !disabled && onSelectDate(ds)} activeOpacity={disabled ? 1 : 0.7}>
              <Text style={[styles.dayText, isToday && !selected && styles.dayTextToday, selected && styles.dayTextSelected, disabled && styles.dayTextDisabled]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing[4] } as ViewStyle,
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] } as ViewStyle,
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.bgSubtle } as ViewStyle,
  navArrow: { fontSize: 20, color: colors.ink, fontFamily: typography.bodyFont, lineHeight: 22 },
  monthLabel: { fontFamily: typography.bodyBold, fontSize: typography.size.base, color: colors.ink },
  weekRow: { flexDirection: 'row', marginBottom: spacing[2] } as ViewStyle,
  weekday: { flex: 1, textAlign: 'center', fontFamily: typography.bodyMedium, fontSize: typography.size.xs, color: colors.inkMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' } as ViewStyle,
  cell: { width: `${100/7}%` as any, height: 40, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  cellToday: { borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md } as ViewStyle,
  cellSelected: { backgroundColor: colors.accent, borderRadius: radius.md } as ViewStyle,
  cellDisabled: { opacity: 0.3 } as ViewStyle,
  dayText: { fontFamily: typography.bodyMedium, fontSize: typography.size.sm, color: colors.ink },
  dayTextToday: { color: colors.accent },
  dayTextSelected: { color: '#fff' },
  dayTextDisabled: { color: colors.inkMuted },
});
