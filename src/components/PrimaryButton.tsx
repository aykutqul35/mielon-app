import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function PrimaryButton({ title, loading, icon, className = '', ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      className={`bg-mielon-gold rounded-full py-4 px-6 items-center flex-row justify-center shadow-sm ${props.disabled ? 'opacity-60' : ''} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FAFAFA" />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text className={`text-white font-bold text-lg ${icon ? 'ml-2' : ''}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
