import * as React from 'react';
import { useContext } from 'react';
import { AppContext } from './AppContext';

export const attachServiceScope = (Component: any) => {
  return (props: any) => {
    const appContext = useContext(AppContext);

    return <Component serviceScope={appContext.serviceScope} {...props} />;
  };
};