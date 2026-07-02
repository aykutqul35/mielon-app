import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-mielon-cream p-6 relative">
      <View className="mb-8 mt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-mielon-charcoal">Merhaba!</Text>
          <Text className="text-base text-mielon-brown mt-1">
            Mielon Pet dünyasına hoş geldiniz.
          </Text>
        </View>
        <TouchableOpacity 
          className="opacity-10 p-2"
          onLongPress={() => navigation.navigate('AdminLogin')}
          delayLongPress={1500}
        >
          <MaterialCommunityIcons name="shield-lock" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      <ServiceCard 
        title="Pet Kuaför"
        description="Dostunuzun tüy bakımını profesyonellere bırakın."
        buttonText="İncele"
        className="mb-4"
        onPress={() => navigation.navigate('Grooming')}
      />

      <ServiceCard 
        title="Pet Otel"
        description="Siz tatildeyken dostunuz da bizim misafirimiz olsun. Güvenli ve sıcak bir ortam."
        buttonText="İncele"
        onPress={() => navigation.navigate('Hotel')}
      />
    </SafeAreaView>
  );
}
