import { Linking, Alert } from 'react-native';

const DUMMY_PHONE_NUMBER = '905551234567'; // Replace with a real number later

export const sendWhatsAppMessage = async (
  service: 'Grooming' | 'Hotel',
  userInfo: { firstName: string; lastName: string; phone: string },
  petInfo: any
) => {
  let message = `*Yeni Mielon Pet Rezervasyonu* 🐾\n\n`;
  message += `👤 *Müşteri Bilgileri*\n`;
  message += `Ad Soyad: ${userInfo.firstName} ${userInfo.lastName}\n`;
  message += `Telefon: ${userInfo.phone}\n\n`;

  message += `🛠 *Hizmet Tipi:* ${service === 'Grooming' ? 'Pet Kuaför' : 'Pet Otel'}\n\n`;

  message += `🐶 *Dostumuzun Bilgileri*\n`;
  message += `Türü: ${petInfo.species === 'Dog' ? 'Köpek' : 'Kedi'}\n`;
  message += `Cinsi: ${petInfo.breed}\n`;
  message += `Yaşı: ${petInfo.age}\n`;
  
  if (service === 'Grooming') {
    message += `Kilosu: ${petInfo.weight} kg\n`;
  }

  if (service === 'Hotel') {
    message += `\n📅 *Otel Takvimi*\n`;
    message += `Check-in: ${petInfo.checkInDate}\n`;
    message += `Check-out: ${petInfo.checkOutDate}\n`;
  }

  message += `\nLütfen en kısa sürede dönüş yapınız.`;

  const url = `whatsapp://send?phone=${DUMMY_PHONE_NUMBER}&text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Hata', 'WhatsApp uygulaması cihazınızda bulunamadı.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Hata', 'Mesaj gönderilirken bir sorun oluştu.');
  }
};
