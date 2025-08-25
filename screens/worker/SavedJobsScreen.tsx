// screens/worker/SavedJobsScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import JobCard from '../../components/JobCard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getJobById } from '../../services/jobs';

const KEY = 'savedJobIds';

export default function SavedJobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const nav = useNavigation<any>();
//   const ids = JSON.parse((await AsyncStorage.getItem('savedJobIds')) || '[]');
//   if (!ids.includes(item.$id)) { ids.push(item.$id); await AsyncStorage.setItem('savedJobIds', JSON.stringify(ids)); }

  async function load() {
    const raw = await AsyncStorage.getItem(KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const items = await Promise.all(ids.map((id) => getJobById(id).catch(() => null)));
    setJobs(items.filter(Boolean));
  }

  async function remove(id: string) {
    const raw = await AsyncStorage.getItem(KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = ids.filter((x) => x !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      data={jobs}
      keyExtractor={(i) => i.$id}
      renderItem={({ item }) => (
        <JobCard
          title={item.title}
          pay={item.pay}
          location={item.location}
          onPress={() => nav.navigate('JobDetails' as never, { id: item.$id } as never)}
          onSave={() => remove(item.$id)}
        />
      )}
      ListEmptyComponent={null}
    />
  );
}
