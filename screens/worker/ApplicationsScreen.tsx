// screens/worker/ApplicationsScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { listMyApplications, withdrawApplication } from '../../services/applications';
import { getJobById } from '../../services/jobs';

export default function ApplicationsScreen() {
  const [apps, setApps] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState<any>({});

  async function load() {
    const res = await listMyApplications();
    setApps(res);
    // hydrate job titles
    const map: Record<string, any> = {};
    await Promise.all(res.map(async (a) => (map[a.jobId] = await getJobById(a.jobId))));
    setHydrated(map);
  }

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      data={apps}
      keyExtractor={(i) => i.$id}
      renderItem={({ item }) => {
        const job = hydrated[item.jobId];
        return (
          <Card containerStyle={{ borderRadius: 16 }}>
            <Card.Title>{job?.title ?? 'Job'}</Card.Title>
            <Card.Divider />
            <Text>Status: {item.status}</Text>
            <Text>Applied: {new Date(item.createdAt).toLocaleString()}</Text>
            <View style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
              {item.status === 'pending' && (
                <Button
                  type="outline"
                  title="Withdraw"
                  onPress={async () => { await withdrawApplication(item.$id); await load(); }}
                />
              )}
            </View>
          </Card>
        );
      }}
    />
  );
}
