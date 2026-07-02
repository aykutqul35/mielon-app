import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGroomingStore } from '../store/useGroomingStore';
import { useHotelStore } from '../store/useHotelStore';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { insertAppointment } from '../utils/supabase';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

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

    // Veritabanına kaydet
    const customerName = `${firstName} ${lastName}`;
    const isInserted = await insertAppointment(customerName, phone, service, petInfo);

    if (!isInserted) {
      console.warn("Veritabanına kayıt başarısız oldu, ancak WhatsApp ile devam ediliyor.");
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
    <SafeAreaView className="flex-1 bg-mielon-cream">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 mt-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color="#334155" />
          </TouchableOpacity>
          <View className="mt-2">
            <Text className="text-3xl font-bold text-mielon-charcoal">Randevu Onayı</Text>
            <Text className="text-mielon-brown mt-1">Son bir adım kaldı!</Text>
          </View>
        </View>

        {/* Sipariş Özeti */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100/50">
          <Text className="text-lg font-bold text-mielon-charcoal mb-4 border-b border-slate-100 pb-2">Rezervasyon Özeti</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-mielon-brown">Hizmet</Text>
              <Text className="font-semibold text-mielon-charcoal">{service === 'Grooming' ? 'Pet Kuaför' : 'Pet Otel'}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-mielon-brown">Türü</Text>
              <Text className="font-semibold text-mielon-charcoal">{petInfo.species === 'Dog' ? 'Köpek' : 'Kedi'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-mielon-brown">Cinsi</Text>
              <Text className="font-semibold text-mielon-charcoal">{petInfo.breed}</Text>
            </View>
            
            {service === 'Hotel' && (
              <View className="mt-4 bg-mielon-gold/10 p-3 rounded-xl border border-orange-100">
                <Text className="text-xs text-mielon-gold mb-1 font-semibold">Otel Tarihleri</Text>
                <Text className="text-sm text-mielon-charcoal">{hotelState.checkInDate} ➡️ {hotelState.checkOutDate}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Kişisel Bilgiler */}
        <View className="mb-8 space-y-2">
          <Text className="text-lg font-bold text-mielon-charcoal mb-2 ml-1">İletişim Bilgileriniz</Text>
          
          <View className="flex-row space-x-4 mb-2">
            <View className="flex-1">
              <FormInput 
                label="Adınız"
                placeholder="Örn: Aykut"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View className="flex-1">
              <FormInput 
                label="Soyadınız"
                placeholder="Örn: Yılmaz"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <FormInput 
            label="Telefon Numaranız"
            placeholder="Örn: 0555 123 45 67"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* WhatsApp Butonu */}
        <PrimaryButton 
          title="WhatsApp'a Gönder"
          onPress={handleCheckout}
          disabled={!isFormValid}
          icon={<MaterialCommunityIcons name="whatsapp" size={24} color="white" />}
          style={{ backgroundColor: isFormValid ? '#25D366' : '#cbd5e1' }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}
