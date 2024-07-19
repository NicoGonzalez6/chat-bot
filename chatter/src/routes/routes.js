import { createBrowserRouter } from "react-router-dom";
import { GlobalLayout } from "../layouts/CoreLayout/components/GlobalLayout";
import { Main } from "../pages/Main/Main";
import { SignUp } from "../pages/SignUp/SignUp";
import { Privatepage } from "../common/components/PrivatePage/PrivatePage";
import { PublicPage } from "../common/components/PublicPage/PublicPage";
import { SignIn } from "../pages/SignIn/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      {
        path: "/sign-up",
        element: (
          <PublicPage>
            <SignUp />
          </PublicPage>
        ),
      },
      {
        path: "/sign-in",
        element: (
          <PublicPage>
            <SignIn />
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
