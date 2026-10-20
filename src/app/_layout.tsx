import { useFonts } from 'expo-font';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { migrate } from '@/lib/db';
import { StoreProvider } from '@/lib/store';
import { c, family, font } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts([{
    fontFamily: family,
    fontDefinitions: [
      { path: require('@expo-google-fonts/hind-siliguri/400Regular/HindSiliguri_400Regular.ttf'), weight: 400 },
      { path: require('@expo-google-fonts/hind-siliguri/600SemiBold/HindSiliguri_600SemiBold.ttf'), weight: 600 },
      { path: require('@expo-google-fonts/hind-siliguri/700Bold/HindSiliguri_700Bold.ttf'), weight: 700 },
    ],
  }]);
  // A font load failure falls back to the system Bangla font rather than blocking the app.
  const ready = loaded || !!error;
  useEffect(() => { if (ready) SplashScreen.hideAsync(); }, [ready]);
  if (!ready) return null;

  return (
    <SQLiteProvider databaseName="amala.db" onInit={migrate}>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: c.bg },
            headerShadowVisible: false,
            headerTintColor: c.text,
            headerTitleStyle: { fontSize: font.lg, fontFamily: family, fontWeight: '700' },
            contentStyle: { backgroundColor: c.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ title: '' }} />
          <Stack.Screen name="cook" options={{ title: 'খাবার বেছে নিন' }} />
          <Stack.Screen name="plan" options={{ title: 'কতটুকু খাবেন' }} />
          <Stack.Screen name="fitness" options={{ title: 'ফিটনেস গাইড' }} />
          <Stack.Screen name="workout/[id]" options={{ title: '' }} />
          <Stack.Screen name="prayer" options={{ title: 'নামাজের হিসাব' }} />
          <Stack.Screen name="books" options={{ title: 'বই পড়া' }} />
          <Stack.Screen name="tasks" options={{ title: 'আজকের কাজ' }} />
          <Stack.Screen name="food/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="history" options={{ title: 'আগের দিনগুলো' }} />
          <Stack.Screen name="favourites" options={{ title: 'প্রিয় খাবার' }} />
          <Stack.Screen name="bmi" options={{ title: 'BMI মাপুন' }} />
          <Stack.Screen name="data" options={{ title: 'তথ্য সংরক্ষণ' }} />
          <Stack.Screen name="about" options={{ title: 'অ্যাপ সম্পর্কে' }} />
        </Stack>
      </StoreProvider>
    </SQLiteProvider>
  );
}

// Shown instead of a crash, e.g. the database fails to open (on web: another tab already holds it).
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  useEffect(() => { SplashScreen.hideAsync(); }, []);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Text style={{ fontSize: 56 }}>😕</Text>
      <Text style={{ fontSize: font.lg, fontWeight: '700', color: c.text, textAlign: 'center' }}>
        কিছু একটা ঠিকমতো চলেনি
      </Text>
      <Text style={{ fontSize: font.md, color: c.muted, textAlign: 'center' }}>
        আপনার তথ্য নিরাপদে আছে। একটু পরে আবার চেষ্টা করুন।
      </Text>
      <Text accessibilityRole="button" onPress={retry}
        style={{ fontSize: font.md, fontWeight: '700', color: c.onAccent, backgroundColor: c.accent,
          paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999, overflow: 'hidden' }}>
        আবার চেষ্টা করুন
      </Text>
    </View>
  );
}
