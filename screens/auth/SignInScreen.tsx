// screens/auth/SignInScreen.tsx
import { useForm, Controller } from 'react-hook-form';
import { Card, Input, Button, Text } from 'react-native-elements';
import { signIn } from '../../services/auth';
import { useAuth } from '../../store/authStore';

export default function SignInScreen({ navigation }: any) {
  const { control, handleSubmit } = useForm<{ email: string; password: string }>();
  const { setUser } = useAuth();
  const onSubmit = async (v: any) => { const u = await signIn(v.email, v.password); setUser(u); };

  return (
    <Card>
      <Card.Title>Welcome back</Card.Title>
      <Card.Divider/>
      <Controller control={control} name="email" render={({ field:{value,onChange} }) => (
        <Input placeholder="Email" value={value} onChangeText={onChange} autoCapitalize="none" />
      )}/>
      <Controller control={control} name="password" render={({ field:{value,onChange} }) => (
        <Input placeholder="Password" value={value} onChangeText={onChange} secureTextEntry />
      )}/>
      <Button title="Sign In" onPress={handleSubmit(onSubmit)} />
      <Text style={{marginTop:12}} onPress={()=>navigation.navigate('SignUp')}>Create account</Text>
    </Card>
  );
}
