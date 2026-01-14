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
            ['/:id', <SharedPage />]
        ]
    },
    {
        path: "/dashboard",
        privateRoute: true,
        routes: [
            ['/projects', <Dashboard />],
            ['/edit', <SharedEditor />],
            ['/settings', <Settings />],
        ]
    }
];

export default routes;