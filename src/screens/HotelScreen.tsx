import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { useHotelStore } from '../store/useHotelStore';
import { fetchBlockedDates } from '../utils/mockApi';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

export default function HotelScreen() {
  const { 
    checkInDate, checkOutDate, species, breed, age, 
    setDates, setSpecies, setBreed, setAge 
  } = useHotelStore();

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSelection, setCurrentSelection] = useState<'checkIn' | 'checkOut'>('checkIn');

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Initial Fetch
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

      // 2. Subscribe to Real-time changes
      const channel = supabase.channel('blocked-dates-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'BlockedDates' }, () => {
          fetchSupabaseBlockedDates();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Fallback: Mock API (Supabase anahtarları yoksa)
      setBlockedDates(fetchBlockedDates());
    }
  }, []);

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;

    // Kapalı tarihe tıklandıysa engelle
    if (blockedDates.includes(dateString)) {
      Alert.alert("Dolu Tarih", "Bu tarih otelimiz tarafından maalesef dolu. Lütfen başka bir tarih seçin.");
      return;
    }

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Yeni bir aralık başlatıyoruz
      setDates(dateString, '');
      setCurrentSelection('checkOut');
    } else {
      // Check-out tarihi Check-in'den önce olamaz
      const inDate = new Date(checkInDate);
      const outDate = new Date(dateString);

      if (outDate <= inDate) {
        setDates(dateString, '');
        setCurrentSelection('checkOut');
        return;
      }

      // İki tarih arasında kapalı (blocked) gün var mı kontrolü
      let isBlockedInBetween = false;
      const iterDate = new Date(inDate);
      iterDate.setDate(iterDate.getDate() + 1);
      
      while (iterDate < outDate) {
        if (blockedDates.includes(iterDate.toISOString().split('T')[0])) {
          isBlockedInBetween = true;
          break;
        }
        iterDate.setDate(iterDate.getDate() + 1);
      }

      if (isBlockedInBetween) {
        Alert.alert("Geçersiz Aralık", "Seçtiğiniz tarihler arasında dolu günler bulunuyor. Lütfen aralığı güncelleyin.");
        setDates(dateString, '');
        setCurrentSelection('checkOut');
      } else {
        setDates(checkInDate, dateString);
        setCurrentSelection('checkIn');
      }
    }
  };

  // Takvim işaretlemelerini dinamik oluştur
  const markedDates = useMemo(() => {
    const marks: any = {};

    // 1. Kapalı günleri işaretle
    blockedDates.forEach(date => {
      marks[date] = { disabled: true, disableTouchEvent: true, color: '#f1f5f9', textColor: '#cbd5e1' };
    });

    // 2. Check-in tarihi
    if (checkInDate) {
      marks[checkInDate] = { startingDay: true, color: '#fb923c', textColor: 'white' };
    }
    
    // 3. Aralığı ve Check-out tarihini işaretle
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const iter = new Date(start);
      iter.setDate(iter.getDate() + 1);

      while (iter < end) {
        const iterStr = iter.toISOString().split('T')[0];
        // Sadece aralıktaki açık günleri boya
        marks[iterStr] = { color: '#ffedd5', textColor: '#fb923c' };
        iter.setDate(iter.getDate() + 1);
      }

      marks[checkOutDate] = { endingDay: true, color: '#fb923c', textColor: 'white' };
    }

    return marks;
  }, [blockedDates, checkInDate, checkOutDate]);

  const navigation = useNavigation<any>();

  const isFormValid = checkInDate !== null && checkOutDate !== null && checkOutDate !== '' && species !== null && breed.trim() !== '' && age.trim() !== '';

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Eksik Bilgi", "Lütfen tarih aralığını ve dostumuzun bilgilerini doldurun.");
      return;
    }
    navigation.navigate('Checkout', { service: 'Hotel' });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="mb-6">
          <Text className="text-3xl font-bold text-slate-800">Pet Otel</Text>
          <Text className="text-slate-500 mt-1">Dostunuz için takvimden uygun günleri seçin.</Text>
        </View>

        {/* Takvim */}
        <View className="bg-white rounded-3xl p-4 shadow-sm mb-6 border border-slate-100/50 overflow-hidden">
          <Calendar
            minDate={new Date().toISOString().split('T')[0]}
            onDayPress={handleDayPress}
            markingType={'period'}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#94a3b8',
              selectedDayBackgroundColor: '#fb923c',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#fb923c',
              dayTextColor: '#334155',
              textDisabledColor: '#e2e8f0',
              arrowColor: '#fb923c',
              monthTextColor: '#1e293b',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500'
            }}
          />
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-slate-100 px-2">
             <View>
               <Text className="text-xs text-slate-400 mb-1">Check-in</Text>
               <Text className={`font-semibold ${checkInDate ? 'text-orange-500' : 'text-slate-700'}`}>{checkInDate || 'Seçiniz'}</Text>
             </View>
             <MaterialCommunityIcons name="arrow-right" size={20} color="#cbd5e1" />
             <View className="items-end">
               <Text className="text-xs text-slate-400 mb-1">Check-out</Text>
               <Text className={`font-semibold ${checkOutDate ? 'text-orange-500' : 'text-slate-700'}`}>{checkOutDate || 'Seçiniz'}</Text>
             </View>
          </View>
        </View>

        {/* Tür Seçimi */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-700 mb-3 ml-1">Türü</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl border ${species === 'Dog' ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200'} shadow-sm`}
              onPress={() => setSpecies('Dog')}
            >
              <MaterialCommunityIcons name="dog" size={24} color={species === 'Dog' ? '#fb923c' : '#94a3b8'} />
              <Text className={`ml-2 font-medium ${species === 'Dog' ? 'text-orange-600' : 'text-slate-500'}`}>Köpek</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl border ${species === 'Cat' ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200'} shadow-sm`}
              onPress={() => setSpecies('Cat')}
            >
              <MaterialCommunityIcons name="cat" size={24} color={species === 'Cat' ? '#fb923c' : '#94a3b8'} />
              <Text className={`ml-2 font-medium ${species === 'Cat' ? 'text-orange-600' : 'text-slate-500'}`}>Kedi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metin Girişleri */}
        <View className="mb-8 space-y-4">
          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Cinsi</Text>
            <TextInput 
              className="bg-white px-4 py-4 rounded-2xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Örn: British Shorthair"
              placeholderTextColor="#94a3b8"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Yaşı</Text>
            <TextInput 
              className="bg-white px-4 py-4 rounded-2xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Örn: 2"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity 
          className={`py-4 rounded-2xl items-center shadow-md ${isFormValid ? 'bg-orange-400' : 'bg-slate-300'}`}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text className={`font-bold text-lg ${isFormValid ? 'text-white' : 'text-slate-500'}`}>Kaydet ve İlerle</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
