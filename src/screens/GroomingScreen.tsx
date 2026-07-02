import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useGroomingStore } from '../store/useGroomingStore';

export default function GroomingScreen() {
  const { 
    species, breed, age, weight, photos, 
    setSpecies, setBreed, setAge, setWeight, 
    addPhotos, removePhoto 
  } = useGroomingStore();

  const handlePickImage = async () => {
    if (photos.length >= 4) {
      Alert.alert("Sınır Aşıldı", "En fazla 4 fotoğraf ekleyebilirsiniz.");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Fotoğraf yüklemek için galeri erişim iznine ihtiyacımız var.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4 - photos.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      addPhotos(uris);
    }
  };

  const navigation = useNavigation<any>();

  const isFormValid = species !== null && breed.trim() !== '' && age.trim() !== '' && weight.trim() !== '';

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    navigation.navigate('Checkout', { service: 'Grooming' });
  };

  return (
    <SafeAreaView className="flex-1 bg-mielon-cream">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="mb-8">
          <Text className="text-3xl font-bold text-mielon-charcoal">Randevu Formu</Text>
          <Text className="text-mielon-brown mt-1">Lütfen dostumuzun detaylarını girin.</Text>
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
        <View className="mb-6 space-y-4">
          <View>
            <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">Cinsi</Text>
            <TextInput 
              className="bg-white px-4 py-4 rounded-2xl border border-mielon-brown/20 text-mielon-charcoal shadow-sm"
              placeholder="Örn: Golden Retriever"
              placeholderTextColor="#94a3b8"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">Yaşı</Text>
              <TextInput 
                className="bg-white px-4 py-4 rounded-2xl border border-mielon-brown/20 text-mielon-charcoal shadow-sm"
                placeholder="Örn: 2"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">Kilosu (kg)</Text>
              <TextInput 
                className="bg-white px-4 py-4 rounded-2xl border border-mielon-brown/20 text-mielon-charcoal shadow-sm"
                placeholder="Örn: 15"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
        </View>

        {/* Fotoğraf Yükleme */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">Fotoğraflar (Opsiyonel, Maks 4)</Text>
          
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {photos.map((uri, index) => (
              <View key={index} className="relative w-[75px] h-[75px] rounded-2xl overflow-hidden shadow-sm border border-mielon-brown/20">
                <Image source={{ uri }} className="w-full h-full" />
                <TouchableOpacity 
                  className="absolute top-1 right-1 bg-black/60 w-6 h-6 rounded-full items-center justify-center"
                  onPress={() => removePhoto(index)}
                >
                  <MaterialCommunityIcons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {photos.length < 4 && (
              <TouchableOpacity 
                className="w-[75px] h-[75px] rounded-2xl border-2 border-dashed border-slate-300 items-center justify-center bg-white"
                onPress={handlePickImage}
              >
                <MaterialCommunityIcons name="camera-plus" size={24} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity 
          className={`py-4 rounded-2xl items-center shadow-md ${isFormValid ? 'bg-mielon-gold' : 'bg-slate-300'}`}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text className={`font-bold text-lg ${isFormValid ? 'text-white' : 'text-mielon-brown'}`}>Kaydet ve İlerle</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
