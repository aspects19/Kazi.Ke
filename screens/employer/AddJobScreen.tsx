// screens/employer/AddJobScreen.tsx
import { useForm, Controller } from 'react-hook-form';
import { Card, Input, Button } from 'react-native-elements';
import { createJob } from '../../services/jobs';
import { useNavigation } from '@react-navigation/native';

export default function AddJobScreen(){
  const nav = useNavigation<any>();
  const { control, handleSubmit } = useForm<any>();

  return (
    <Card>
      <Card.Title>Post a Job</Card.Title>
      <Card.Divider/>
      {['title','location','pay','description','tags'].map((name)=>(
        <Controller
          key={name}
          control={control}
          name={name as any}
          render={({ field:{value,onChange} }) => (
            <Input placeholder={name} value={value} onChangeText={onChange} />
          )}
        />
      ))}
      <Button title="Create" onPress={handleSubmit(async (v)=>{ await createJob(v); nav.navigate('JobsPosted'); })}/>
    </Card>
  );
}
