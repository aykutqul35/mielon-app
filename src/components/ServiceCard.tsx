import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps, Image } from 'react-native';

interface ServiceCardProps extends TouchableOpacityProps {
  title: string;
  description: string;
  buttonText?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

export default function ServiceCard({ title, description, buttonText = "İncele", icon, imageUrl, className = '', ...props }: ServiceCardProps) {
  return (
    <TouchableOpacity 
      className={`bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden ${className}`}
      activeOpacity={0.9}
      {...props}
    >
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-48 bg-slate-100"
          resizeMode="cover"
        />
      )}
      <View className="p-6">
        <View className="flex-row items-center mb-3">
          {icon && <View className="mr-3">{icon}</View>}
          <Text className="text-2xl font-bold text-mielon-charcoal">{title}</Text>
        </View>
        <Text className="text-mielon-brown mb-5 leading-6 text-base">
          {description}
        </Text>
        <View className="bg-mielon-gold/10 self-start px-6 py-3 rounded-full">
          <Text className="text-mielon-gold font-bold">{buttonText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
