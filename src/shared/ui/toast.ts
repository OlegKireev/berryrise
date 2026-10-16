import { Alert, Platform, ToastAndroid } from 'react-native';

// Короткое подтверждение, что действие прошло. На iOS системных тостов нет, там алерт
export function toast(text: string) {
  if (Platform.OS === 'android') ToastAndroid.show(text, ToastAndroid.SHORT);
  else Alert.alert(text);
}
