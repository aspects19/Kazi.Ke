// screens/employer/JobsPostedScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { listMyJobs, closeJob } from '../../services/jobs';
import { useNavigation } from '@react-navigation/native';

export default function JobsPostedScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const nav = useNavigation<any>();

  async function load() {
    setJobs(await listMyJobs());
  }

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      data={jobs}
      keyExtractor={(i) => i.$id}
      renderItem={({ item }) => (
        <Card containerStyle={{ borderRadius: 16 }}>
          <Card.Title>{item.title}</Card.Title>
          <Card.Divider />
          <Text>Location: {item.location}</Text>
          <Text>Pay: {item.pay}</Text>
          <Text>Status: {item.status}</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
            <Button
              title="View"
              type="outline"
              onPress={() => nav.navigate('JobDetails' as never, { id: item.$id } as never)}
            />
            {item.status === 'open' && (
              <Button
                title="Close"
                onPress={async () => { await closeJob(item.$id); await load(); }}
              />
            )}
          </View>
        </Card>
      )}
    />
  );
}
