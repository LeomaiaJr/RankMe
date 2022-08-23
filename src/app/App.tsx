import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import { ThemeProvider } from '../_start/layout/core';
import { MasterLayout } from '../_start/layout/MasterLayout';
import { AuthPage } from './modules/auth';
import { Logout } from './modules/auth/Logout';
import { PrivateRoutes } from './routing/PrivateRoutes';

type Props = {
  basename: string;
};

const App: React.FC<Props> = ({ basename }) => {
  useEffect(() => {
    const token = getAuthToken();
    if (
      (token === undefined || token === '') &&
      !document.location.href.includes('auth/login')
    ) {
      document.location.href = '/start-react-free/auth/login';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={AuthPage} />
          <MasterLayout>
            <PrivateRoutes />
          </MasterLayout>
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export { App };
