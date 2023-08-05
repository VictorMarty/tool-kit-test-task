import { createBrowserRouter } from "react-router-dom";
import Main from "../../pages/main";
import RepoPage from "../../pages/repoPage";

const isDev = import.meta.env.VITE_NODE_ENV === "dev";
const basename = !isDev ? import.meta.env.VITE_BASENAME : "/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/:id",
      element: <RepoPage />,
    },
  ],
  {
    basename: basename,
  },
);

export default router;
