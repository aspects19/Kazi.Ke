import { Card, Text, Button } from 'react-native-elements';
import { View } from 'react-native';
import { formatMoney } from '../utils/format';

type Props = { title: string; pay?: number; location?: string; onPress?: () => void; onSave?: () => void; };
export default function JobCard({ title, pay, location, onPress, onSave }: Props) {
  return (
    <Card containerStyle={{ borderRadius: 16 }}>
      <Card.Title>{title}</Card.Title>
      <Card.Divider />
      <Text>{location}</Text>
      {typeof pay === 'number' && <Text style={{ marginTop: 6 }}>{formatMoney(pay)}/month</Text>}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Button title="Details" onPress={onPress} />
        <Button title="Save" type="outline" onPress={onSave} />
      </View>
    </Card>
  );
}
