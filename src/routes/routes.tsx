import NotFound from "@pages/notFound";
import Dashboard from "@pages/dashboard";
import PresentationPage from "@pages/presentation";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ['/', <Dashboard />],
            ['/:id', <PresentationPage />],
            ['/not-found', <NotFound />],
        ]
    }
];

export default routes;
