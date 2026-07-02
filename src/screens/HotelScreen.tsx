import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HotelScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 p-6">
      <Text className="text-3xl font-bold text-slate-800 mb-2 mt-4">Pet Otel</Text>
      <Text className="text-slate-500 mb-8 leading-5">
        Dostunuzun konforu için takvimden uygun günleri seçin.
      </Text>
      
      <View className="bg-white rounded-3xl p-6 shadow-sm items-center justify-center flex-1 mb-8 border border-slate-100/50">
         <Text className="text-slate-400 font-medium">Takvim (Calendars) Eklenecek</Text>
      </View>
    </SafeAreaView>
  );
}
