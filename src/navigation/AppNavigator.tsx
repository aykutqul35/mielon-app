import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import GroomingScreen from '../screens/GroomingScreen';
import HotelScreen from '../screens/HotelScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { useAuthStore } from '../store/useAuthStore';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { isAdmin } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D4AF37', // Mielon Gold
        tabBarInactiveTintColor: '#94a3b8', // Soft Gray
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // White background
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Grooming" 
        component={GroomingScreen} 
        options={{
          tabBarLabel: 'Kuaför',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cut-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Hotel" 
        component={HotelScreen} 
        options={{
          tabBarLabel: 'Otel',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" color={color} size={size} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminDashboardScreen} 
          options={{
            tabBarLabel: 'Yönetim',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield-checkmark-outline" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
