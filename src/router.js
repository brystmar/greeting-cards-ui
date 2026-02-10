import { createBrowserRouter } from "react-router";
import AppLayout from "./App";
// import Households from "./pages/Households";
// import Events from "./pages/Events";
// import Cards from "./pages/Cards";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            // { index: true, element: <Households /> },
            // { path: "households", element: <Households /> },
            // { path: "events", element: <Events /> },
            // { path: "cards", element: <Cards /> },
        ],
    },
]);

export default router;
