// screens/auth/SignInScreen.tsx
import { useForm, Controller } from 'react-hook-form';
import { Card, Input, Button, Text } from 'react-native-elements';
import { signIn } from '../../services/auth';
import { useAuth } from '../../store/authStore';

type Form = { email: string; password: string };

export default function SignInScreen({ navigation }: any) {
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: { email: '', password: '' }, // <-- avoid uncontrolled warning
  });
  const { setUser } = useAuth();

  const onSubmit = async (v: Form) => {
    const u = await signIn(v.email.trim(), v.password);
    setUser(u);
  };

  return (
    <Card>
      <Card.Title>Welcome back</Card.Title>
      <Card.Divider />
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { value, onChange } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { value, onChange } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      <Button title="Sign In" onPress={handleSubmit(onSubmit)} />
      <Text style={{ marginTop: 12 }} onPress={() => navigation.navigate('SignUp')}>
        Create account
      </Text>
    </Card>
  );
}
