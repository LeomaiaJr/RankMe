import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import { ClassPage } from "../pages/ClassPage";
import { TopicPage } from "../pages/TopicPage";
import { LightDashboardWrapper } from "../pages/dashboards/light-dashboard/LightDashboardWrapper";
import { StartDashboardWrapper } from "../pages/dashboards/start-dashboard/StartDashboardWrapper";
import { HomePage } from "../pages/HomePage";
import { MenuTestPage } from "../pages/MenuTestPage";
import { QuestionPage } from "../pages/QuestionPage";
import { Logout } from "../modules/auth/Logout";

export function PrivateRoutes() {
  const ProfilePageWrapper = lazy(
    () => import("../modules/profile/ProfilePageWrapper")
  );
  const GeneralPageWrapper = lazy(
    () => import("../modules/general/GeneralPageWrapper")
  );
  const DocsPageWrapper = lazy(() => import("../modules/docs/DocsPageWrapper"));

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path="/dashboard" component={StartDashboardWrapper} />
        <Route path="/light" component={LightDashboardWrapper} />
        <Route path="/general" component={GeneralPageWrapper} />
        <Route path="/profile" component={ProfilePageWrapper} />
        <Route path="/menu-test" component={MenuTestPage} />
        <Route path="/docs" component={DocsPageWrapper} />
        <Route path="/home" component={HomePage} />
        <Route path="/class/:id" component={ClassPage} />
        <Route path="/topic/:id" component={TopicPage} />
        <Route path="/question/:id" component={QuestionPage} />
        <Route path="/logout" component={Logout} />
        <Redirect from="/auth" to="/home" />
        <Redirect exact from="/" to="/home" />
        <Redirect to="home" />
      </Switch>
    </Suspense>
  );
}
