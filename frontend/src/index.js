import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from 'App';
import { AppProvider } from "contexts/AppContext";

import InjectAxios from "components/InjectAxios";

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
        <InjectAxios />
        <App />
      </AppProvider>
      
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);