import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

export default function AdminLoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      Alert.alert('Hata', 'Supabase yapılandırılmamış. Lütfen .env dosyanızı güncelleyin.');
      return;
    }

    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'E-posta ve şifre zorunludur.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Giriş Başarısız', error.message);
    } else {
      Alert.alert('Başarılı', 'Yönetici girişi yapıldı.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-mielon-cream justify-center px-8">
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="absolute top-12 left-6 p-2"
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#334155" />
      </TouchableOpacity>

      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-mielon-gold/10 rounded-full items-center justify-center mb-4">
          <MaterialCommunityIcons name="shield-lock-outline" size={40} color="#D4AF37" />
        </View>
        <Text className="text-3xl font-bold text-mielon-charcoal">Yönetici Girişi</Text>
        <Text className="text-mielon-brown mt-2 text-center">Sadece yetkili personel içindir.</Text>
      </View>

      <View className="mb-8 space-y-2">
        <FormInput 
          label="E-posta"
          placeholder="admin@mielon.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <FormInput 
          label="Şifre"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <PrimaryButton 
        title="Giriş Yap"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        icon={<MaterialCommunityIcons name="login" size={24} color="white" />}
      />
    </SafeAreaView>
  );
}
