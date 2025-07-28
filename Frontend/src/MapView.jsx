import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';
import { useMapContext } from './context/MapContext';
import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';



Modal.setAppElement('#root');

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blackIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({ mode, handleClick }) {
  useMapEvents({
    click(e) {
      if (!mode) return;
      handleClick(e.latlng);
    },
  });
  return null;
}

function Section({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sidebar-section">
      <h3 onClick={() => setOpen(!open)} className="section-title">{title} {open ? '▼' : '▶'}</h3>
      {open && <div className="sidebar-content">{children}</div>}
    </div>
  );
}

function MapView() {
  const {
    mode, setMode,
    markers,
    lines, setLines,
    polygons, setPolygons,
    linePoints, setLinePoints,
    polygonPoints, setPolygonPoints,
    addMarker, deleteMarker
  } = useMapContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputName, setInputName] = useState('');
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [pendingType, setPendingType] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [selectedLineIndex, setSelectedLineIndex] = useState('');
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const inputRef = useRef(null);
  const [selectedList, setSelectedList] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen]);

  const handleMapClick = (latlng) => {
    if (mode === 'marker') {
      setClickedLatLng(latlng);
      setPendingType('marker');
      setModalOpen(true);
    } else if (mode === 'line') {
      const newPoint = { id: Date.now().toString(), lat: latlng.lat, lng: latlng.lng };
      const updated = [...linePoints, newPoint];
      setLinePoints(updated);
      if (updated.length === 2) {
        setClickedLatLng(updated);
        setPendingType('line');
        setModalOpen(true);
      }
    } else if (mode === 'polygon') {
      const newPoint = { id: Date.now().toString(), lat: latlng.lat, lng: latlng.lng };
      setPolygonPoints(prev => [...prev, newPoint]);
    }
  };

  const handleModalSubmit = () => {
    if (!inputName) return;

    if (pendingType === 'marker') {
      const { lat, lng } = clickedLatLng;
      const point = { id: Date.now().toString(), lat, lng, name: inputName };
      addMarker(point);
      showToast('Nokta Eklendi');
    } else if (pendingType === 'line') {
      const namedPoints = clickedLatLng.map(p => ({ ...p, name: inputName }));
      const newLine = { points: namedPoints, name: inputName };
      setLines(prev => [...prev, newLine]);
      sendLineToBackend(newLine);
      setLinePoints([]);
      showToast('Çizgi Eklendi');
    } else if (pendingType === 'polygon') {
      const namedPoints = polygonPoints.map(p => ({ ...p, name: inputName }));
      const newPolygon = { points: namedPoints, name: inputName };
      setPolygons(prev => [...prev, newPolygon]);
      sendPolygonToBackend(newPolygon);
      setPolygonPoints([]);
      showToast('Poligon Eklendi');
    }

    setInputName('');
    setClickedLatLng(null);
    setPendingType('');
    setModalOpen(false);
  };

  const finishPolygon = () => {
    if (polygonPoints.length < 3) return alert('En az 3 nokta seçmelisiniz.');
    setPendingType('polygon');
    setModalOpen(true);
  };

  const removePointFromPolygon = (polyIndex, pointIndex) => {
    const updated = [...polygons];
    updated[polyIndex].points.splice(pointIndex, 1);
    setPolygons(updated);
  };

  const deleteMarkerById = async () => {
  if (!deleteId) return alert('Silinecek marker ID girin.');
  try {
    await deleteMarker(deleteId);
    showToast('Nokta Silindi');
  } catch (err) {
    console.error('Silme hatası:', err);
    showToast('Silinemedi');
  }
  setDeleteId('');
};


  const deleteLineByIndex = async () => {
    if (selectedLineIndex === '') return;
    const name = lines[selectedLineIndex]?.name;
    const updated = [...lines];
    updated.splice(parseInt(selectedLineIndex), 1);
    setLines(updated);
    setSelectedLineIndex('');
    showToast('Çizgi Silindi');
    try {
      await axios.delete(`http://localhost:5290/api/line/by-name/${encodeURIComponent(name)}`);
    } catch (err) {
      console.error("Backend'den silinemedi:", err);
    }
  };

  const deletePolygonByIndex = async () => {
    if (selectedPolygonIndex === '') return;
    const name = polygons[selectedPolygonIndex]?.name;
    const updated = [...polygons];
    updated.splice(parseInt(selectedPolygonIndex), 1);
    setPolygons(updated);
    setSelectedPolygonIndex('');
    showToast('Poligon Silindi');
    try {
      await axios.delete(`http://localhost:5290/api/polygon/by-name/${encodeURIComponent(name)}`);
    } catch (err) {
      console.error("Backend'den poligon silinemedi:", err);
    }
  };

  const convertLineToWKT = (points) => {
    const coords = points.map(p => `${p.lng} ${p.lat}`).join(', ');
    return `LINESTRING(${coords})`;
  };

  const sendLineToBackend = async (line) => {
    const wkt = convertLineToWKT(line.points);
    await axios.post('http://localhost:5290/api/line', {
      name: line.name || 'Çizgi',
      wkt: wkt
    });
  };

  const convertPolygonToWKT = (points) => {
    const coords = points.map(p => `${p.lng} ${p.lat}`);
    coords.push(coords[0]);
    return `POLYGON((${coords.join(', ')}))`;
  };

  const sendPolygonToBackend = async (poly) => {
    const wkt = convertPolygonToWKT(poly.points);
    await axios.post('http://localhost:5290/api/polygon', {
      name: poly.name || 'Poligon',
      wkt: wkt
    });
  };

  const filteredMarkers = filterType === 'all' || filterType === 'markers' ? markers : [];
  const filteredLines = filterType === 'all' || filterType === 'lines' ? lines : [];
  const filteredPolygons = filterType === 'all' || filterType === 'polygons' ? polygons : [];

  return (
    <div className="map-wrapper">
      <div className={`toast ${toastMessage ? 'show' : ''}`}>{toastMessage}</div>
      <div style={{ position: 'absolute', top: 15, right: 15, zIndex: 1100, padding: '6px 12px', backgroundColor: '#3949ab', color: 'white', borderRadius: '6px', fontSize: '14px' }}>
        Mode: <strong>{mode || 'Seçilmedi'}</strong>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>İşlemler</h2>
        <Section title="Görüntüleme Filtresi">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tümünü Göster</option>
            <option value="markers">Sadece Noktalar</option>
            <option value="lines">Sadece Çizgiler</option>
            <option value="polygons">Sadece Poligonlar</option>
          </select>
        </Section>
        <Section title="📍 Nokta İşlemleri">
          <button onClick={() => setMode('marker')}>🖱 Haritadan Nokta Ekle</button>
        </Section>
        <Section title="📏 Çizgi İşlemleri">
          <button onClick={() => setMode('line')}>🖱 Haritadan Çizgi Çek</button>
        </Section>
        <Section title="📐 Alan İşlemleri">
          <button onClick={() => setMode('polygon')}>🖱 Haritadan Alan Çiz</button>
          <button onClick={finishPolygon} disabled={polygonPoints.length < 3}>✅ Poligon Çizimini Bitir</button>
        </Section>
        <Section title="🗑 Silme İşlemleri">
  <button onClick={() => setMode('delete')}>🖱 Haritadan Nokta Sil</button>

  <input
    type="text"
    placeholder="Silinecek ID"
    value={deleteId}
    onChange={(e) => setDeleteId(e.target.value)}
  />
  <button onClick={deleteMarkerById}>Noktayı Sil</button>

  <h4>Çizgi Sil</h4>
  <select value={selectedLineIndex} onChange={(e) => setSelectedLineIndex(e.target.value)}>
    <option value="">Çizgi Seçin</option>
    {lines.map((line, i) => (
      <option key={i} value={i}>
        {line.name || `Çizgi ${i + 1}`}
      </option>
    ))}
  </select>
  <button onClick={deleteLineByIndex}>Çizgiyi Sil</button>

  <h4>Poligon Sil</h4>
  <select value={selectedPolygonIndex} onChange={(e) => setSelectedPolygonIndex(e.target.value)}>
    <option value="">Poligon Seçin</option>
    {polygons.map((poly, i) => (
      <option key={i} value={i}>
        {poly.name || `Poligon ${i + 1}`}
      </option>
    ))}
  </select>
  <button onClick={deletePolygonByIndex}>Poligonu Sil</button>
</Section>

        <Section title="📋 Listele">
  <div>
    <button onClick={() => { setSelectedList('point'); setVisibleCount(20); }}>Nokta Listesi</button>
    <button onClick={() => { setSelectedList('line'); setVisibleCount(20); }}>Çizgi Listesi</button>
    <button onClick={() => { setSelectedList('polygon'); setVisibleCount(20); }}>Poligon Listesi</button>
  </div>

  {selectedList === 'point' && (
    <div>
      <h4>Nokta Listesi</h4>
      {markers.length === 0 ? <p>Hiç nokta yok.</p> : (
        <ul>
          {markers.slice(0, visibleCount).map((m, i) => (
            <li key={i}>
  <strong>{m.name}</strong>
  <span>WKT: POINT({m.lng} {m.lat})</span>
</li>

          ))}
        </ul>
      )}
      {markers.length > visibleCount && (
        <button onClick={() => setVisibleCount(visibleCount + 20)}>Daha Fazla Göster</button>
      )}
    </div>
  )}

  {selectedList === 'line' && (
    <div>
      <h4>Çizgi Listesi</h4>
      {lines.length === 0 ? <p>Çizgi yok.</p> : (
        <ul>
          {lines.slice(0, visibleCount).map((line, i) => (
            <li key={i}>
  <strong>{line.name}</strong>
  <span>WKT: LINESTRING({line.points.map(p => `${p.lng} ${p.lat}`).join(', ')})</span>
</li>

          ))}
        </ul>
      )}
      {lines.length > visibleCount && (
        <button onClick={() => setVisibleCount(visibleCount + 20)}>Daha Fazla Göster</button>
      )}
    </div>
  )}

  {selectedList === 'polygon' && (
    <div>
      <h4>Poligon Listesi</h4>
      {polygons.length === 0 ? <p>Poligon yok.</p> : (
        <ul>
          {polygons.slice(0, visibleCount).map((poly, i) => (
            <li key={i}>
  <strong>{poly.name}</strong>
  <span>
    WKT: POLYGON(({[...poly.points.map(p => `${p.lng} ${p.lat}`), `${poly.points[0].lng} ${poly.points[0].lat}`].join(', ')}))
  </span>
</li>

          ))}
        </ul>
      )}
      {polygons.length > visibleCount && (
        <button onClick={() => setVisibleCount(visibleCount + 20)}>Daha Fazla Göster</button>
      )}
    </div>
  )}
</Section>


      </div>

      <button className="toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '×' : '≡'}
      </button>

      <div style={{ position: 'absolute', top: 15, right: 15, zIndex: 1100, padding: '6px 12px', backgroundColor: '#3949ab', color: 'white', borderRadius: '6px', fontSize: '14px' }}>
        Mode: <strong>{mode || 'Seçilmedi'}</strong>
      </div>

      <MapContainer center={[39.9208, 32.8541]} zoom={6} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomright" />
        <MapClickHandler mode={mode} handleClick={handleMapClick} />

        {linePoints.map((point, i) => (
          <Marker key={`line-temp-${i}`} position={[point.lat, point.lng]} icon={redIcon} />
        ))}

        {polygonPoints.map((point, i) => (
          <Marker key={`poly-temp-${i}`} position={[point.lat, point.lng]} icon={redIcon} />
        ))}

        {filteredMarkers.map((point, i) => (
          <Marker
            key={point.id || i}
            position={[point.lat, point.lng]}
            icon={blueIcon}
            eventHandlers={{
              click: () => {
                if (mode === 'delete') {
                  const confirmDelete = window.confirm(`\"${point.name}\" (ID: ${point.id}) adlı noktayı silmek istiyor musunuz?`);
                  if (confirmDelete) deleteMarker(point.id);
                }
              },
            }}
          >
            <Popup>
              <strong>{point.name}</strong><br />ID: {point.id}
            </Popup>
          </Marker>
        ))}

        {filteredLines.map((line, i) => (
          <Polyline key={i} positions={line.points.map(p => [p.lat, p.lng])} color="red">
            <Popup><strong>{line.name}</strong></Popup>
            {line.points.map((p, j) => (
              <Marker key={`${i}-${j}`} position={[p.lat, p.lng]} icon={blueIcon}>
                <Popup>{p.name}</Popup>
              </Marker>
            ))}
          </Polyline>
        ))}

        {filteredPolygons.map((poly, i) => (
          <Polygon key={i} positions={poly.points.map(p => [p.lat, p.lng])} pathOptions={{ color: 'green' }}>
            <Popup><strong>{poly.name}</strong></Popup>
            {poly.points.map((p, j) => (
              <Marker
                key={`poly-marker-${i}-${j}`}
                position={[p.lat, p.lng]}
                icon={blackIcon}
                eventHandlers={{
                  click: () => {
                    if (mode === 'delete') {
                      const confirmRemove = window.confirm(`Poligon ${i + 1} içinden \"${p.name}\" noktasını silmek istiyor musunuz?`);
                      if (confirmRemove) removePointFromPolygon(i, j);
                    }
                  }
                }}
              >
                <Popup>{p.name}</Popup>
              </Marker>
            ))}
          </Polygon>
        ))}
      </MapContainer>

      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="modal" overlayClassName="overlay">
        <span className="modal-close" onClick={() => setModalOpen(false)}>×</span>
        <h2>İsim Girin</h2>
        <input
          ref={inputRef}
          type="text"
          placeholder={pendingType === 'line' ? 'Çizgi Adı' : pendingType === 'polygon' ? 'Poligon Adı' : 'Şehir Adı'}
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleModalSubmit();
          }}
        />
        <button onClick={handleModalSubmit}>Kaydet</button>
      </Modal>
    </div>
  );
}

export default MapView;
