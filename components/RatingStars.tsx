import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export default function RatingStars({ value = 0, size = 16 }: { value?: number; size?: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(value));
  return (
    <View style={{ flexDirection: 'row' }}>
      {stars.map((filled, i) => (
        <Icon key={i} type="material-community" name={filled ? 'star' : 'star-outline'} size={size} />
      ))}
    </View>
  );
}
