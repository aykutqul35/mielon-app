import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGroomingStore } from '../store/useGroomingStore';
import { useHotelStore } from '../store/useHotelStore';
import { sendWhatsAppMessage } from '../utils/whatsapp';

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const service = route.params?.service as 'Grooming' | 'Hotel';

  const groomingState = useGroomingStore();
  const hotelState = useHotelStore();

  const petInfo = service === 'Grooming' ? groomingState : hotelState;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && phone.trim() !== '';

  const handleCheckout = async () => {
    if (!isFormValid) {
      Alert.alert('Eksik Bilgi', 'Lütfen kişisel bilgilerinizi eksiksiz doldurun.');
      return;
    }

    // WhatsApp'a Gönder
    await sendWhatsAppMessage(service, { firstName, lastName, phone }, petInfo);

    // Başarılı ise global state'leri temizle ve ana ekrana dön
    if (service === 'Grooming') {
      groomingState.resetForm();
    } else {
      hotelState.resetForm();
    }
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 mt-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color="#334155" />
          </TouchableOpacity>
          <View className="mt-2">
            <Text className="text-3xl font-bold text-slate-800">Randevu Onayı</Text>
            <Text className="text-slate-500 mt-1">Son bir adım kaldı!</Text>
          </View>
        </View>

        {/* Sipariş Özeti */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100/50">
          <Text className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Rezervasyon Özeti</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">Hizmet</Text>
              <Text className="font-semibold text-slate-700">{service === 'Grooming' ? 'Pet Kuaför' : 'Pet Otel'}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">Türü</Text>
              <Text className="font-semibold text-slate-700">{petInfo.species === 'Dog' ? 'Köpek' : 'Kedi'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-500">Cinsi</Text>
              <Text className="font-semibold text-slate-700">{petInfo.breed}</Text>
            </View>
            
            {service === 'Hotel' && (
              <View className="mt-4 bg-orange-50 p-3 rounded-xl border border-orange-100">
                <Text className="text-xs text-orange-600 mb-1 font-semibold">Otel Tarihleri</Text>
                <Text className="text-sm text-slate-700">{hotelState.checkInDate} ➡️ {hotelState.checkOutDate}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Kişisel Bilgiler */}
        <View className="mb-8 space-y-4">
          <Text className="text-lg font-bold text-slate-800 mb-2 ml-1">İletişim Bilgileriniz</Text>
          
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Adınız</Text>
              <TextInput 
                className="bg-white px-4 py-4 rounded-2xl border border-slate-200 text-slate-800 shadow-sm"
                placeholder="Örn: Aykut"
                placeholderTextColor="#94a3b8"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Soyadınız</Text>
              <TextInput 
                className="bg-white px-4 py-4 rounded-2xl border border-slate-200 text-slate-800 shadow-sm"
                placeholder="Örn: Yılmaz"
                placeholderTextColor="#94a3b8"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Telefon Numaranız</Text>
            <TextInput 
              className="bg-white px-4 py-4 rounded-2xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Örn: 0555 123 45 67"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* WhatsApp Butonu */}
        <TouchableOpacity 
          className={`py-4 rounded-2xl flex-row items-center justify-center shadow-md ${isFormValid ? 'bg-[#25D366]' : 'bg-slate-300'}`}
          onPress={handleCheckout}
          disabled={!isFormValid}
        >
          <MaterialCommunityIcons name="whatsapp" size={24} color={isFormValid ? 'white' : '#94a3b8'} />
          <Text className={`font-bold text-lg ml-2 ${isFormValid ? 'text-white' : 'text-slate-500'}`}>WhatsApp'a Gönder</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
