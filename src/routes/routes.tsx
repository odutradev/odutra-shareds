import NotFound from "@pages/notFound";
import Dashboard from "@pages/dashboard";
import PresentationPage from "@pages/presentation";
import Home from "@pages/home";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ['/', <Home />],
            ['/dashboard/projects', <Dashboard />],
            ['/:id', <PresentationPage />],
            ['/not-found', <NotFound />],
        ]
    }
];

export default routes;