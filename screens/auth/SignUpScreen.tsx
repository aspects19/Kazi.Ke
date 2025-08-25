// screens/auth/SignUpScreen.tsx
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Input, Button, Text, ButtonGroup } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import { signUp } from '../../services/auth';
import { useAuth } from '../../store/authStore';

type Form = { name: string; phone: string; email: string; password: string };

export default function SignUpScreen({ navigation }: any) {
  const [selected, setSelected] = useState(0); // 0=worker,1=employer
  const role = selected === 0 ? 'worker' : 'employer';
  const { control, handleSubmit } = useForm<Form>();
  const { setUser } = useAuth();

  const onSubmit = async (v: Form) => {
    const u = await signUp(v.name, v.phone, role as any, v.email, v.password);
    setUser(u);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Card containerStyle={{ borderRadius: 16 }}>
        <Card.Title>Create account</Card.Title>
        <Card.Divider />
        <Text style={{ marginBottom: 8 }}>I am signing up as:</Text>
        <ButtonGroup
          onPress={setSelected}
          selectedIndex={selected}
          buttons={['Worker', 'Employer']}
          containerStyle={{ borderRadius: 12, marginBottom: 16 }}
        />
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Input placeholder="Full name" value={value} onChangeText={onChange} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Input placeholder="Phone number" value={value} onChangeText={onChange} keyboardType="phone-pad" />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Input placeholder="Email" value={value} onChangeText={onChange} autoCapitalize="none" />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: true, minLength: 6 }}
          render={({ field: { value, onChange } }) => (
            <Input placeholder="Password" value={value} onChangeText={onChange} secureTextEntry />
          )}
        />
        <Button title="Create account" onPress={handleSubmit(onSubmit)} />
        <View style={{ height: 8 }} />
        <Button type="clear" title="Have an account? Sign in" onPress={() => navigation.navigate('SignIn')} />
      </Card>
    </ScrollView>
  );
}
