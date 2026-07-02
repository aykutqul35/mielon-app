import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

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
        <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
          <MaterialCommunityIcons name="shield-lock-outline" size={40} color="#D4AF37" />
        </View>
        <Text className="text-3xl font-bold text-mielon-charcoal">Yönetici Girişi</Text>
        <Text className="text-mielon-brown mt-2 text-center">Sadece yetkili personel içindir.</Text>
      </View>

      <View className="mb-8 space-y-4">
        <View>
          <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">E-posta</Text>
          <TextInput 
            className="bg-white px-4 py-4 rounded-2xl border border-mielon-brown/20 text-mielon-charcoal shadow-sm"
            placeholder="admin@mielon.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">Şifre</Text>
          <TextInput 
            className="bg-white px-4 py-4 rounded-2xl border border-mielon-brown/20 text-mielon-charcoal shadow-sm"
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity 
        className={`py-4 rounded-2xl items-center shadow-md flex-row justify-center ${loading ? 'bg-orange-300' : 'bg-mielon-gold'}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : (
          <>
            <MaterialCommunityIcons name="login" size={24} color="white" />
            <Text className="font-bold text-lg text-white ml-2">Giriş Yap</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
