
// screens/worker/WorkerProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input, Card, Avatar, Divider } from '@rneui/themed';
import { useAuth } from '../../store/authStore';
import { updateProfile, signOut } from '../../services/auth';
import RatingStars from '../../components/RatingStars';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useNavigation } from '@react-navigation/native'; // ✅ Import this
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../app/AuthNavigator';

export default function WorkerProfileScreen() {
  const { user: me, setUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>(); // ✅ Typed navigation

  const [name, setName] = useState(me?.name || '');
  const [phone, setPhone] = useState(me?.phone || '');
  const [saving, setSaving] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  async function save() {
    try {
      setSaving(true);
      await updateProfile({ name, phone });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function confirmLogout() {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout },
      ]
    );
  }

  async function handleLogout() {
    try {
      setLoadingLogout(true);
      await signOut();
      setUser(null); // ✅ triggers Root re-render
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }], // ✅ Auth stack route
      });
    } catch (err: any) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoadingLogout(false);
    }
  }

  if (!me) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card containerStyle={{ borderRadius: 16 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar rounded size="large" title={me.name?.[0] ?? 'U'} />
          <Text style={{ fontSize: 20, fontWeight: '600' }}>{me.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <RatingStars value={me.rating ?? 0} />
            {me.verified && <VerifiedBadge />}
            <Text>({me.ratingsCount ?? 0})</Text>
          </View>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={save} disabled={saving} />

        <Button
          title={loadingLogout ? 'Logging out...' : 'Logout'}
          type="outline"
          onPress={confirmLogout}
          buttonStyle={{ borderColor: 'red' }}
          titleStyle={{ color: 'red' }}
          containerStyle={{ marginTop: 16 }}
          disabled={loadingLogout}
        />
      </Card>
    </View>
  );
}
