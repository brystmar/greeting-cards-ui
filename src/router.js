import { createBrowserRouter, Navigate } from "react-router"
import App from "./App";
import HouseholdsPage from "./pages/HouseholdsPage";
import EventsPage from "./pages/EventsPage";
import CardsPage from "./pages/CardsPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/households" replace /> },
            { path: "households", element: <HouseholdsPage /> },
            { path: "events", element: <EventsPage /> },
            { path: "cards", element: <CardsPage /> },
            { path: "*", element: <NotFound /> }
        ]
    }
]);

export default router;
