import NotFound from "@pages/notFound";
import Dashboard from "@pages/dashboard";
import SharedEditor from "@pages/sharedEditor";
import SharedPage from "@pages/shared";
import Settings from "@pages/settings";
import Home from "@pages/home";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ['/', <Home />],
            ['/dashboard/projects', <Dashboard />],
            ['/dashboard/edit', <SharedEditor />],
            ['/dashboard/settings', <Settings />],
            ['/:id', <SharedPage />],
            ['/not-found', <NotFound />],
        ]
    }
];

export default routes;