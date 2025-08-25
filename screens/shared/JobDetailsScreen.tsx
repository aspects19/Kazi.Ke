// screens/shared/JobDetailsScreen.tsx
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { getJobById, applyToJob } from '../../services/jobs';

export default function JobDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [job, setJob] = useState<any>(null);

  useEffect(() => { (async () => setJob(await getJobById(id)))(); }, [id]);
  if (!job) return null;

  return (
    <ScrollView>
      <Card containerStyle={{ borderRadius: 16 }}>
        <Card.Title>{job.title}</Card.Title>
        <Card.Divider />
        <Text h4>Pay</Text><Text>{job.pay}</Text>
        <Text h4 style={{ marginTop: 12 }}>Description</Text><Text>{job.description}</Text>
        {/* <Button title="Apply" containerStyle={{ marginTop: 16 }} onPress={() => applyToJob(job.$id)} /> */}.
        // screens/shared/JobDetailsScreen.tsx (replace Apply handler)
        <Button
        title="Apply"
        containerStyle={{ marginTop: 16 }}
        onPress={async () => { await applyToJob(job.$id); }}
        />

      </Card>
    </ScrollView>
  );
}
