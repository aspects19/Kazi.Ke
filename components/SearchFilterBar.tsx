import { Input, Button } from 'react-native-elements';
import { View } from 'react-native';
import React, { useState } from 'react';

type Props = { onChange: (q: { q: string; role?: string; location?: string; minPay?: number }) => void; };
export default function SearchFilterBar({ onChange }: Props) {
  const [q, setQ] = useState('');
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
      <Input placeholder="Search jobs..." value={q} onChangeText={setQ} />
      <Button title="Apply Filters" onPress={() => onChange({ q })} />
    </View>
  );
}
