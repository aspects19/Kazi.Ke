// screens/worker/WorkerJobsScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import JobCard from '../../components/JobCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import { listJobs } from '../../services/jobs';
import { useNavigation } from '@react-navigation/native';

export default function WorkerJobsScreen() {
  const [data, setData] = useState<any[]>([]);
  const nav = useNavigation<any>();

  async function run(q?: any) {
    const jobs = await listJobs(q);
    setData(jobs);
  }

  useEffect(() => { run(); }, []);

  return (
    <>
      <SearchFilterBar onChange={run} />
      <FlatList
        data={data}
        keyExtractor={(i) => i.$id}
        renderItem={({ item }) => (
          <JobCard
            title={item.title}
            pay={item.pay}
            location={item.location}
            onPress={() => nav.navigate('JobDetails' as never, { id: item.$id } as never)}
            onSave={() => {/* TODO: save */}}
          />
        )}
      />
    </>
  );
}
