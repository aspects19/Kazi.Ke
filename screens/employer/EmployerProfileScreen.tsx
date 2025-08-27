
// screens/employer/EmployerProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Card, Input, Button, Text } from 'react-native-elements';
import { getMyProfile, updateMyProfile } from '../../services/users';

export default function EmployerProfileScreen() {
  const [me, setMe] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const p = await getMyProfile();
    setMe(p);
    setName(p?.name ?? '');
    setPhone(p?.phone ?? '');
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try { await updateMyProfile({ name, phone }); await load(); } finally { setSaving(false); }
  }

  if (!me) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Card containerStyle={{ borderRadius: 16 }}>
        <Avatar rounded size="large" title={me.name?.[0] ?? 'U'} containerStyle={{ alignSelf: 'center' }} />
        <Text h4 style={{ textAlign: 'center', marginTop: 8 }}>{me.name}</Text>
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={save} disabled={saving} />
      </Card>
    </ScrollView>
  );
}
