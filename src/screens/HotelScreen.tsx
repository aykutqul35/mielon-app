import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { useHotelStore } from '../store/useHotelStore';
import { fetchBlockedDates } from '../utils/mockApi';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

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
      marks[checkInDate] = { startingDay: true, color: '#D4AF37', textColor: 'white' };
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
        marks[iterStr] = { color: '#ffedd5', textColor: '#D4AF37' };
        iter.setDate(iter.getDate() + 1);
      }

      marks[checkOutDate] = { endingDay: true, color: '#D4AF37', textColor: 'white' };
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
    <SafeAreaView className="flex-1 bg-mielon-cream">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="mb-6">
          <Text className="text-3xl font-bold text-mielon-charcoal">Pet Otel</Text>
          <Text className="text-mielon-brown mt-1">Dostunuz için takvimden uygun günleri seçin.</Text>
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
              selectedDayBackgroundColor: '#D4AF37',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#D4AF37',
              dayTextColor: '#334155',
              textDisabledColor: '#e2e8f0',
              arrowColor: '#D4AF37',
              monthTextColor: '#1e293b',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500'
            }}
          />
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-slate-100 px-2">
             <View>
               <Text className="text-xs text-mielon-brown mb-1">Check-in</Text>
               <Text className={`font-semibold ${checkInDate ? 'text-mielon-gold' : 'text-mielon-charcoal'}`}>{checkInDate || 'Seçiniz'}</Text>
             </View>
             <Ionicons name="arrow-forward-outline" size={20} color="#cbd5e1" />
             <View className="items-end">
               <Text className="text-xs text-mielon-brown mb-1">Check-out</Text>
               <Text className={`font-semibold ${checkOutDate ? 'text-mielon-gold' : 'text-mielon-charcoal'}`}>{checkOutDate || 'Seçiniz'}</Text>
             </View>
          </View>
        </View>

        {/* Tür Seçimi */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-mielon-charcoal mb-3 ml-1">Türü</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl border ${species === 'Dog' ? 'bg-mielon-gold/10 border-mielon-gold' : 'bg-white border-mielon-brown/20'} shadow-sm`}
              onPress={() => setSpecies('Dog')}
            >
              <MaterialCommunityIcons name="dog" size={24} color={species === 'Dog' ? '#D4AF37' : '#94a3b8'} />
              <Text className={`ml-2 font-medium ${species === 'Dog' ? 'text-mielon-gold' : 'text-mielon-brown'}`}>Köpek</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl border ${species === 'Cat' ? 'bg-mielon-gold/10 border-mielon-gold' : 'bg-white border-mielon-brown/20'} shadow-sm`}
              onPress={() => setSpecies('Cat')}
            >
              <MaterialCommunityIcons name="cat" size={24} color={species === 'Cat' ? '#D4AF37' : '#94a3b8'} />
              <Text className={`ml-2 font-medium ${species === 'Cat' ? 'text-mielon-gold' : 'text-mielon-brown'}`}>Kedi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metin Girişleri */}
        <View className="mb-8 space-y-2">
          <FormInput 
            label="Cinsi"
            placeholder="Örn: British Shorthair"
            value={breed}
            onChangeText={setBreed}
          />
          <FormInput 
            label="Yaşı"
            placeholder="Örn: 2"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Kaydet Butonu */}
        <PrimaryButton 
          title="Kaydet ve İlerle"
          onPress={handleSubmit}
          disabled={!isFormValid}
        />

      </ScrollView>
    </SafeAreaView>
  );
