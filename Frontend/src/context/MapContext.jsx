import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MapContext = createContext();
const LINE_API = 'https://localhost:7042/api/line';
const POLYGON_API = 'https://localhost:7042/api/polygon';


export const MapProvider = ({ children }) => {
  const [mode, setMode] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [linePoints, setLinePoints] = useState([]);
  const [polygonPoints, setPolygonPoints] = useState([]);

  const API_URL = 'https://localhost:7042/api/point';

  // Sayfa yüklendiğinde marker verilerini çekmeye yarar
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const apiMarkers = res.data.map(item => {
          const wkt = item.wkt;
          const coords = wkt.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
          const lng = parseFloat(coords[1]);
          const lat = parseFloat(coords[2]);
          return {
            id: item.id,      
            lat,
            lng,
            name: item.name
          };
        });
        setMarkers(apiMarkers);
  
      })
      .catch(err => {
        console.error('Veriler alınamadı:', err);
      });

    axios.get(LINE_API)
    .then(res => {
      const lineList = res.data.map(item => {
        const coords = item.wkt.match(/LINESTRING\(([^)]+)\)/)[1]
          .split(',').map(pair => {
            const [lng, lat] = pair.trim().split(' ').map(Number);
            return { lat, lng };
          });
        return {
        id: item.id,          
        name: item.name,
        points: coords
      };
      });
      setLines(lineList);
    })
    .catch(err => console.error('Çizgi verileri alınamadı:', err));

    axios.get(POLYGON_API)
    .then(res => {
      const polygonList = res.data.map(item => {
        const coords = item.wkt.match(/POLYGON\(\(([^)]+)\)\)/)[1]
          .split(',').map(pair => {
            const [lng, lat] = pair.trim().split(' ').map(Number);
            return { lat, lng };
          });
        return {
        id: item.id,        
        name: item.name,
        points: coords
      };
      });
      setPolygons(polygonList);
    })
    .catch(err => console.error('Poligon verileri alınamadı:', err));
  }, []);

  // Marker ekle
  const addMarker = async (marker) => {
  try {
    const res = await axios.post(API_URL, {
      name: marker.name,
      wkt: `POINT(${marker.lng} ${marker.lat})`
    });

    const newMarker = {
      ...marker,
      id: res.data.id  // Backend’in verdiği gerçek ID
    };

    setMarkers((prev) => [...prev, newMarker]);
  } catch (err) {
    console.error("Marker eklenemedi:", err);
  }
};


  // Marker sil (ID ile)
 const deleteMarker = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    setMarkers((prev) => prev.filter((m) => m.id !== parseInt(id))); 
  } catch (err) {
    console.error('Nokta silinirken hata:', err);
  }
};


  // Çizgi kaydet (LineString WKT)
const saveLine = async (linePoints, name = "Yeni Çizgi") => {
  if (linePoints.length !== 2) return alert("Çizgi için 2 nokta gerekli.");
  const wkt = `LINESTRING(${linePoints.map(p => `${p.lng} ${p.lat}`).join(', ')})`;
  try {
    await axios.post(LINE_API, { name, wkt });
    console.log("Çizgi kaydedildi");
  } catch (err) {
    console.error("Çizgi kaydedilemedi:", err);
  }
};

// Poligon kaydet (Polygon WKT)
const savePolygon = async (polygonPoints, name = "Yeni Alan") => {
  if (polygonPoints.length < 3) return alert("Poligon için en az 3 nokta gerekli.");
  const coords = polygonPoints.map(p => `${p.lng} ${p.lat}`);
  coords.push(`${polygonPoints[0].lng} ${polygonPoints[0].lat}`); // İlk noktayla kapat
  const wkt = `POLYGON((${coords.join(', ')}))`;
  try {
    await axios.post(POLYGON_API, { name, wkt });
    console.log("Poligon kaydedildi");
  } catch (err) {
    console.error("Poligon kaydedilemedi:", err);
  }
};

const deleteLine = async (id) => {
  try {
    await axios.delete(`https://localhost:7042/api/line/${id}`);
    setLines(prev => prev.filter(l => l.id !== id));
  } catch (err) {
    console.error('Çizgi silinemedi:', err);
  }
};

const deletePolygon = async (id) => {
  try {
    await axios.delete(`https://localhost:7042/api/polygon/${id}`);
    setPolygons(prev => prev.filter(p => p.id !== id));
  } catch (err) {
    console.error('Poligon silinemedi:', err);
  }
};



  return (
    <MapContext.Provider value={{
      mode, setMode,
      markers, setMarkers,
      lines, setLines,
      polygons, setPolygons,
      linePoints, setLinePoints,
      polygonPoints, setPolygonPoints,
      addMarker,
      deleteMarker,
      saveLine,
      savePolygon,
      deleteLine,
      deletePolygon

    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
