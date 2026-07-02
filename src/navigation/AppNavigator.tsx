import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        tabBarActiveTintColor: '#fb923c', // Tailwind orange-400
        tabBarInactiveTintColor: '#94a3b8', // Tailwind slate-400
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.05,
          shadowRadius: 10,
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
            <MaterialCommunityIcons name="home-variant-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Grooming" 
        component={GroomingScreen} 
        options={{
          tabBarLabel: 'Kuaför',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="content-cut" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Hotel" 
        component={HotelScreen} 
        options={{
          tabBarLabel: 'Otel',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="domain" color={color} size={size} />
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
              <MaterialCommunityIcons name="shield-star" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
