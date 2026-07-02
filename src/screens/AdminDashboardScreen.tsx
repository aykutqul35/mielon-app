import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { supabase, isSupabaseConfigured, toggleBlockedDate } from '../utils/supabase';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminDashboardScreen() {
  const { logout } = useAuthStore();
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const fetchSupabaseBlockedDates = async () => {
        const { data, error } = await supabase
          .from('BlockedDates')
          .select('date')
          .eq('is_blocked', true);
        
        if (!error && data) {
          setBlockedDates(data.map((item: any) => item.date));
        }
      };
      
      fetchSupabaseBlockedDates();

      const channel = supabase.channel('admin-blocked-dates-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'BlockedDates' }, () => {
          fetchSupabaseBlockedDates();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleDayPress = async (day: DateData) => {
    // Toggle using the mock admin function which operates on the DB
    await toggleBlockedDate(day.dateString);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    logout();
  };

  const markedDates = useMemo(() => {
    const marks: any = {};
    blockedDates.forEach(date => {
      marks[date] = { 
        selected: true, 
        selectedColor: '#ef4444', // Kırmızı, kapalı olduğunu göstermek için
      };
    });
    return marks;
  }, [blockedDates]);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="px-6 pt-4 pb-6 flex-row justify-between items-center border-b border-slate-800">
        <View>
          <Text className="text-2xl font-bold text-white">Yönetim Paneli</Text>
          <Text className="text-slate-400 mt-1">Takvimi yönetmek için günlere dokunun.</Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-slate-800 p-3 rounded-full"
        >
          <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4">
        <View className="bg-slate-800 rounded-3xl p-4 shadow-lg overflow-hidden border border-slate-700">
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#1e293b',
              calendarBackground: '#1e293b',
              textSectionTitleColor: '#94a3b8',
              selectedDayBackgroundColor: '#ef4444',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#fb923c',
              dayTextColor: '#f8fafc',
              textDisabledColor: '#475569',
              arrowColor: '#fb923c',
              monthTextColor: '#f8fafc',
              textMonthFontWeight: 'bold',
            }}
          />
        </View>
        <Text className="text-center text-slate-500 mt-6 text-sm">Kırmızı günler kullanıcılara "Dolu" olarak görünür.</Text>
      </View>
    </SafeAreaView>
  );
}
