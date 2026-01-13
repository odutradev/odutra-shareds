import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReloadHandler from "@routes/components/reloadHandler";
import routesPaths from "@routes/routes";
import useSystemStore from "@stores/system";
const Router = () => {
  const { system } = useSystemStore();
  return (
    <BrowserRouter>
      <ReloadHandler />
      <Routes>
        {routesPaths.map(({ path, privateRoute, routes }) =>
          routes.map(([itemPath, element]) => {
            const basePath = path === "/" ? "" : path;
            const fullPath = basePath + itemPath;
            return (
              <Route
                key={fullPath}
                path={fullPath}
                element={privateRoute && !system.isAuthenticated ? <Navigate to="/" /> : element}
              />
          )})
        )}
      </Routes>
    </BrowserRouter>
  );
};
export default Router;