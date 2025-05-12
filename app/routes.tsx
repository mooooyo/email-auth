import React from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./root";
import Home from "./routes/_index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/about",
    element: <Home />,
  },
]);

export default router;
