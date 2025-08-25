import { Card, Text, Button } from 'react-native-elements';
import RatingStars from './RatingStars';
import VerifiedBadge from './VerifiedBadge';
import { View } from 'react-native';

export default function EmployeeCard({ name, rating, availability, verified, onContact }:{
  name:string; rating?:number; availability?:string; verified?:boolean; onContact?:()=>void
}) {
  return (
    <Card containerStyle={{ borderRadius: 16 }}>
      <Card.Title>{name}</Card.Title>
      <Card.Divider/>
      <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
        <RatingStars value={rating ?? 0} />
        {verified && <VerifiedBadge/>}
      </View>
      <Text style={{ marginTop:6 }}>Availability: {availability}</Text>
      <Button title="Contact" containerStyle={{ marginTop: 12 }} onPress={onContact}/>
    </Card>
  );
}
