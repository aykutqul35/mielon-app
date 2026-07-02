import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { supabase, isSupabaseConfigured, toggleBlockedDate } from '../utils/supabase';
import { useAuthStore } from '../store/useAuthStore';

type TabType = 'Calendar' | 'Inbox';

export default function AdminDashboardScreen() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('Calendar');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Takvim verileri
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

  // Fetch appointments when Inbox tab is active
  useEffect(() => {
    if (activeTab === 'Inbox' && isSupabaseConfigured && supabase) {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase!
      .from('Appointments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAppointments(data);
    }
    setLoading(false);
  };

  const handleDayPress = async (day: DateData) => {
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
        selectedColor: '#5D4037',
      };
    });
    return marks;
  }, [blockedDates]);

  const renderAppointment = ({ item }: { item: any }) => (
    <View className="bg-mielon-charcoal rounded-2xl p-4 mb-4 border border-mielon-brown/50 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-white font-bold text-lg">{item.customer_name}</Text>
          <Text className="text-mielon-brown text-sm mt-1">{item.phone}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${item.service_type === 'Grooming' ? 'bg-indigo-500/20 border border-indigo-500/50' : 'bg-emerald-500/20 border border-emerald-500/50'}`}>
          <Text className={`text-xs font-semibold ${item.service_type === 'Grooming' ? 'text-indigo-400' : 'text-emerald-400'}`}>
            {item.service_type === 'Grooming' ? 'Kuaför' : 'Otel'}
          </Text>
        </View>
      </View>
      <View className="bg-mielon-cream rounded-xl p-3 mt-2">
        <Text className="text-slate-300 text-sm">Tür: {item.pet_details?.species === 'Dog' ? 'Köpek' : 'Kedi'} | Cins: {item.pet_details?.breed}</Text>
        <Text className="text-mielon-brown text-xs mt-1">Yaş: {item.pet_details?.age} {item.service_type === 'Hotel' ? `| Tarih: ${item.pet_details?.checkInDate} - ${item.pet_details?.checkOutDate}` : `| Kilo: ${item.pet_details?.weight}`}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-mielon-cream">
      <View className="px-6 pt-4 pb-4 flex-row justify-between items-center border-b border-mielon-brown/50">
        <View>
          <Text className="text-2xl font-bold text-mielon-charcoal">Yönetim Paneli</Text>
          <Text className="text-mielon-brown mt-1">Takvim ve Gelen Kutusu</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-mielon-charcoal p-3 rounded-full">
          <MaterialCommunityIcons name="logout" size={24} color="#5D4037" />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View className="px-6 py-4">
        <View className="flex-row bg-mielon-charcoal rounded-xl p-1">
          <TouchableOpacity 
            className={`flex-1 py-2 items-center rounded-lg ${activeTab === 'Calendar' ? 'bg-slate-700 shadow-sm' : ''}`}
            onPress={() => setActiveTab('Calendar')}
          >
            <Text className={`font-semibold ${activeTab === 'Calendar' ? 'text-white' : 'text-mielon-brown'}`}>Takvim</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 items-center rounded-lg ${activeTab === 'Inbox' ? 'bg-slate-700 shadow-sm' : ''}`}
            onPress={() => setActiveTab('Inbox')}
          >
            <Text className={`font-semibold ${activeTab === 'Inbox' ? 'text-white' : 'text-mielon-brown'}`}>Gelen Kutusu</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {activeTab === 'Calendar' ? (
          <>
            <View className="bg-mielon-charcoal rounded-3xl p-4 shadow-lg overflow-hidden border border-mielon-brown/50">
              <Calendar
                onDayPress={handleDayPress}
                markedDates={markedDates}
                theme={{
                  backgroundColor: '#1e293b',
                  calendarBackground: '#1e293b',
                  textSectionTitleColor: '#94a3b8',
                  selectedDayBackgroundColor: '#5D4037',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#D4AF37',
                  dayTextColor: '#f8fafc',
                  textDisabledColor: '#475569',
                  arrowColor: '#D4AF37',
                  monthTextColor: '#f8fafc',
                  textMonthFontWeight: 'bold',
                }}
              />
            </View>
            <Text className="text-center text-mielon-brown mt-6 text-sm">Kırmızı günler kullanıcılara "Dolu" olarak görünür.</Text>
          </>
        ) : (
          <View className="flex-1 px-2">
            {loading ? (
              <ActivityIndicator size="large" color="#D4AF37" className="mt-10" />
            ) : appointments.length > 0 ? (
              <FlatList
                data={appointments}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={renderAppointment}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <View className="items-center justify-center mt-10">
                <MaterialCommunityIcons name="inbox-outline" size={48} color="#475569" />
                <Text className="text-mielon-brown mt-4">Henüz randevu bulunmuyor.</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
