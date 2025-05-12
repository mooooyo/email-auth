import { Outlet } from "react-router";

export function Root() {
  return (
    <>
      <head></head>
      <main>
        <h1>Hello World!!!!!!!!!!!!!!!!!!</h1>
        <Outlet />
      </main>
    </>
  );
}
