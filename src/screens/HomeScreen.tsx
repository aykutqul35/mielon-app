import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 p-6 relative">
      <View className="mb-8 mt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-slate-800">Merhaba!</Text>
          <Text className="text-base text-slate-500 mt-1">
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

      <View className="bg-white rounded-3xl p-6 shadow-sm mb-4">
        <Text className="text-xl font-bold text-slate-800 mb-2">Pet Kuaför</Text>
        <Text className="text-slate-500 mb-4 leading-5">
          Dostunuzun tüy bakımını profesyonellere bırakın.
        </Text>
        <TouchableOpacity 
          className="bg-orange-400 rounded-xl py-3 items-center shadow-sm"
          onPress={() => navigation.navigate('Grooming')}
        >
          <Text className="text-white font-semibold">İncele</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-sm">
        <Text className="text-xl font-bold text-slate-800 mb-2">Pet Otel</Text>
        <Text className="text-slate-500 mb-4 leading-5">
          Siz tatildeyken dostunuz da bizim misafirimiz olsun. Güvenli ve sıcak bir ortam.
        </Text>
        <TouchableOpacity 
          className="bg-orange-400 rounded-xl py-3 items-center shadow-sm"
          onPress={() => navigation.navigate('Hotel')}
        >
          <Text className="text-white font-semibold">İncele</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
