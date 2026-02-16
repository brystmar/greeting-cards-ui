import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import router from "./router";
import "./normalize.css";

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
