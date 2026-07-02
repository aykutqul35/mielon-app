import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// Sadece anahtarlar eklendiğinde Supabase'i aktif et
export const isSupabaseConfigured = 
  supabaseUrl !== 'YOUR_SUPABASE_URL_HERE' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Mock Admin Function to toggle a blocked date.
 * Can be called with a date string 'YYYY-MM-DD'.
 */
export const toggleBlockedDate = async (dateStr: string) => {
  if (!supabase) {
    console.warn('[Admin Mock] Supabase yapılandırılmamış. Lütfen .env dosyanızı güncelleyin.');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('BlockedDates')
      .select('*')
      .eq('date', dateStr)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
      console.error('Error fetching date:', error);
      return;
    }

    if (data) {
      // Toggle is_blocked
      await supabase
        .from('BlockedDates')
        .update({ is_blocked: !data.is_blocked })
        .eq('id', data.id);
    } else {
      // Insert new blocked date
      await supabase
        .from('BlockedDates')
        .insert({ date: dateStr, is_blocked: true });
    }
  } catch (err) {
    console.error('Toggle function error:', err);
  }
};
