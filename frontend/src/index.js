import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from 'App';
import { AppProvider } from "contexts/AppContext";
import { AuthProvider } from "contexts/AuthContext";

import InjectAxios from "components/InjectAxios";

import "primereact/resources/themes/lara-light-indigo/theme.css";  // tema
import "primereact/resources/primereact.min.css";                  // core css
import "primeicons/primeicons.css";                               // iconos
import "/node_modules/primeflex/primeflex.css";                   // utilities

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: Infinity
    },
  },
});

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AuthProvider>
          <InjectAxios />
          <App />
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);