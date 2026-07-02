import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ServiceCardProps extends TouchableOpacityProps {
  title: string;
  description: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

export default function ServiceCard({ title, description, buttonText = "İncele", icon, className = '', ...props }: ServiceCardProps) {
  return (
    <TouchableOpacity 
      className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-50 ${className}`}
      activeOpacity={0.9}
      {...props}
    >
      <View className="flex-row items-center mb-3">
        {icon && <View className="mr-3">{icon}</View>}
        <Text className="text-xl font-bold text-mielon-charcoal">{title}</Text>
      </View>
      <Text className="text-mielon-brown mb-5 leading-5">
        {description}
      </Text>
      <View className="bg-mielon-gold/10 self-start px-5 py-2.5 rounded-full">
        <Text className="text-mielon-gold font-semibold">{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
}
