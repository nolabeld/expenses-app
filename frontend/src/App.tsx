import './App.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function fetchTotalSpent() {
      const res = await fetch('api/expenses/getTotalSpent');
      const data = await res.json();
      setTotalSpent(data.total);
    }

    fetchTotalSpent();
  });

  return (
    <div className='w-[400px] m-auto'>
      <Card className='text-left'>
        <CardHeader>
          <CardTitle>Total spent</CardTitle>
          <CardDescription>Total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </div>
  );
}

export default App;
