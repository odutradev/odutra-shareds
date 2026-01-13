import NotFound from "@pages/notFound";
import Dashboard from "@pages/dashboard";
import PresentationEditor from "@pages/presentationEditor";
import PresentationPage from "@pages/presentation";
import Settings from "@pages/settings";
import Home from "@pages/home";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ['/', <Home />],
            ['/dashboard/projects', <Dashboard />],
            ['/dashboard/edit', <PresentationEditor />],
            ['/dashboard/settings', <Settings />],
            ['/:id', <PresentationPage />],
            ['/not-found', <NotFound />],
        ]
    }
];

export default routes;