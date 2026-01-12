import NotFound from "@pages/notFound";
import Dashboard from "@pages/dashboard";
import PresentationEditor from "@pages/presentationEditor";
import PresentationPage from "@pages/presentation";
import Home from "@pages/home";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ['/', <Home />],
            ['/dashboard/projects', <Dashboard />],
            ['/dashboard/edit', <PresentationEditor />],
            ['/:id', <PresentationPage />],
            ['/not-found', <NotFound />],
        ]
    }
];

export default routes;