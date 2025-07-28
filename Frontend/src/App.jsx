import React from 'react';
import MapView from './MapView';
import { MapProvider } from './context/MapContext';

function App() {
  return (
    <MapProvider>
      <div style={{ height: "100vh", width: "100%" }}>
        <MapView />
      </div>
    </MapProvider>
  );
}

export default App;
