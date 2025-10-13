import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { AppLayout } from './ui/app-layout';
import { Garage } from './ui/garage-page';
import { Winners } from './ui/winners-page';

import { store } from './store/store';
import { RaceContextProvider } from './ui/providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RaceContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Garage />} />
              <Route path="winners" element={<Winners />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RaceContextProvider>
    </Provider>
  </StrictMode>,
);
