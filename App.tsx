import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './src/navigation/AppNavigator';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import { supabase, isSupabaseConfigured } from './src/utils/supabase';
import { useAuthStore } from './src/store/useAuthStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const { setSession, setIsAdmin } = useAuthStore();

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const adminEmail = process.env.EXPO_PUBLIC_ADMIN_EMAIL;

      // Initial session fetch
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setIsAdmin(session?.user?.email === adminEmail);
      });

      // Auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setIsAdmin(session?.user?.email === adminEmail);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [setSession, setIsAdmin]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={AppNavigator} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
