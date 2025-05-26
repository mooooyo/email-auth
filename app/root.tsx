import { Outlet } from 'react-router';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

export function Root() {
  return (
    <>
      <head></head>
      <main>
        <h1>Hello World!!!!!!!!!!!!!!!!!!</h1>
        <Input />
        <Button>Click me </Button>
        <Outlet />
      </main>
    </>
  );
}
