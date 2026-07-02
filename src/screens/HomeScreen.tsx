import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-mielon-cream">
      <ScrollView className="flex-1 px-6 pt-8 pb-12" showsVerticalScrollIndicator={false}>
        <View className="mb-10 flex-row justify-between items-start">
          <View>
            <Text className="text-4xl font-extrabold text-mielon-charcoal tracking-tight">Merhaba,</Text>
            <Text className="text-lg text-mielon-brown mt-2">
              Mielon Pet dünyasına hoş geldiniz.
            </Text>
          </View>
          <TouchableOpacity 
            className="opacity-10 p-2"
            onLongPress={() => navigation.navigate('AdminLogin')}
            delayLongPress={1500}
          >
            <Ionicons name="lock-closed-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ServiceCard 
          title="Pet Kuaför"
          description="Dostunuzun tüy bakımını profesyonellere bırakın. Lüks ve rahatlatıcı bir spa deneyimi."
          buttonText="Randevu Al"
          imageUrl="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop"
          className="mb-8 shadow-md"
          onPress={() => navigation.navigate('Grooming')}
        />

        <ServiceCard 
          title="Pet Otel"
          description="Siz tatildeyken dostunuz da bizim misafirimiz olsun. Güvenli, geniş ve sıcak bir ortam."
          buttonText="Tarih Seç"
          imageUrl="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=800&auto=format&fit=crop"
          className="mb-12 shadow-md"
          onPress={() => navigation.navigate('Hotel')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
