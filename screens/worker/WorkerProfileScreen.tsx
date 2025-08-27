
// screens/worker/WorkerProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Card, Text, Input, Button, Divider } from 'react-native-elements';
import { getMyProfile, updateMyProfile, listVerifiedReviewsForWorker } from '../../services/users';
import RatingStars from '../../components/RatingStars';
import VerifiedBadge from '../../components/VerifiedBadge';

export default function WorkerProfileScreen() {
  const [me, setMe] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const p = await getMyProfile();
    setMe(p);
    setName(p?.name ?? '');
    setPhone(p?.phone ?? '');
    const r = await listVerifiedReviewsForWorker(p.id);
    setReviews(r);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try {
      await updateMyProfile({ name, phone });
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (!me) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
      <Card containerStyle={{ borderRadius: 16 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar rounded size="large" title={me.name?.[0] ?? 'U'} />
          <Text h4>{me.name}</Text>
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
      </Card>

      <Card containerStyle={{ borderRadius: 16 }}>
        <Card.Title>Verified Reviews</Card.Title>
        <Card.Divider />
        {reviews.length === 0 ? (
          <Text>No verified reviews yet.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.$id} style={{ marginBottom: 12 }}>
              <RatingStars value={r.rating} />
              <Text style={{ marginTop: 6 }}>{r.comment}</Text>
              <Text style={{ opacity: 0.6, marginTop: 4 }}>
                From employer • {new Date(r.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}
