// screens/employer/EmployeesScreen.tsx
import { useEffect, useState } from 'react';
import { FlatList, Linking } from 'react-native';
import EmployeeCard from '../../components/EmployeeCard';
import { listWorkers } from '../../services/users';

export default function EmployeesScreen() {
  const [workers, setWorkers] = useState<any[]>([]);
  useEffect(() => { (async () => setWorkers(await listWorkers()))(); }, []);

  return (
    <FlatList
      data={workers}
      keyExtractor={(i) => i.$id}
      renderItem={({ item }) => (
        <EmployeeCard
          name={item.name}
          role="worker"
          rating={item.rating}
          verified={item.verified}
          availability={item.availability ?? 'Available'}
          onContact={() => Linking.openURL(`tel:${item.phone}`)}
        />
      )}
    />
  );
}
