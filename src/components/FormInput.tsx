import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="text-sm font-semibold text-mielon-charcoal mb-2 ml-1">{label}</Text>
      <TextInput 
        className="bg-white px-5 py-4 rounded-2xl border border-mielon-brown/10 text-mielon-charcoal shadow-sm"
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
