import { createBrowserRouter } from "react-router-dom";
import { GlobalLayout } from "../layouts/CoreLayout/components/GlobalLayout";
import { Main } from "../pages/Main/Main";
import { Auth } from "../pages/Auth/Auth";
import { Privatepage } from "../common/components/PrivatePage/PrivatePage";
import { PublicPage } from "../common/components/PublicPage/PublicPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      {
        path: "/auth",
        element: (
          <PublicPage>
            <Auth />
          </PublicPage>
        ),
      },
      {
        path: "/",
        element: (
          <Privatepage>
            <Main />
          </Privatepage>
        ),
      },
    ],
  },
]);
