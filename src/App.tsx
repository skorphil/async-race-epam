import { useEffect, useState } from 'react';
import { garage } from './services';
import type { Car } from './model';

function App() {
  const [cars, setCars] = useState<null | Car[]>(null);
  useEffect(() => {
    const fetchCars = async () => {
      setCars((await garage.getCars()).cars);
    };
    fetchCars();
  }, []);
  return (
    <div>
      {cars?.map((car) => (
        <p>{car.name}</p>
      ))}
    </div>
  );
}

export default App;
