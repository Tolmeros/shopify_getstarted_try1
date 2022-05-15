import React from 'react';
import {ClientRouter, RoutePropagator} from '@shopify/app-bridge-react';
import { useLocation } from 'react-router-dom';

function RouterProvider({navigate, children}) {
  const history = {
    replace: (path) => {
      navigate(path);
    },
  }
  const location = useLocation();
  console.log('RouterProvider', location);
  return (
  <React.Fragment>
    <ClientRouter history={history} />
    <RoutePropagator location={location}/>
    {children}
  </React.Fragment>
  );
};

export default RouterProvider;
