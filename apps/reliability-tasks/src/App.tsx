import { Theme } from '@radix-ui/themes';
import { useEffect } from 'react';
import { Button } from '@reliability-ui';

function App() {
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(console.log);
  }, []);

  return (
    <>
      <Theme>
        <div className="bg-blue-600 flex items-center justify-center">Test</div>
        <Button intent="primary" size="lg">
          Primary Button
        </Button>
      </Theme>
    </>
  );
}

export default App;
