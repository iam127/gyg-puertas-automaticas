import { Linking, Alert } from 'react-native';

export const NativeLinking = {
  callPhone: async (phone: string): Promise<void> => {
    try {
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      const url = `tel:${cleanPhone}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'La función de llamadas no es compatible con este dispositivo.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la llamada.');
    }
  },

  openWhatsApp: async (phone: string, message: string): Promise<void> => {
    try {
      // Remover caracteres no numéricos excepto el prefijo del país
      let cleanPhone = phone.replace(/[^\d]/g, '');
      
      // Si el número no tiene código de país, añadir el de Perú (+51) por defecto
      if (cleanPhone.length === 9) {
        cleanPhone = `51${cleanPhone}`;
      }

      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      
      // Intentar abrir WhatsApp web o app directamente
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrese de tener la aplicación instalada.');
    }
  },

  openGoogleMaps: async (address: string, district: string = ''): Promise<void> => {
    try {
      const query = encodeURIComponent(`${address}, ${district}, Lima, Peru`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir Google Maps.');
    }
  },
};

export default NativeLinking;
