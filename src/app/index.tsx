import { StyleSheet, Text, View } from 'react-native';

// ponytail: заглушка, пока нет экрана "Сегодня"
export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Решено</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
