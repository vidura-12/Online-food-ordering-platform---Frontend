import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Header from '../../components/common/headerlanding';
import Footer from '../../components/common/footerLanding';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─── ORDER STAGES ───────────────────────────────────────────
// 0  waiting_restaurant  → pulsing screen, no map
// 1  accepted            → restaurant confirmed, finding driver
// 2  preparing           → kitchen is cooking
// 3  driver_assigned     → driver moving on map
// 4  delivered           → done
// ────────────────────────────────────────────────────────────

const STAGES = [
  { key: 'waiting_restaurant', label: 'Waiting for restaurant', icon: '🍽️', color: 'amber'  },
  { key: 'accepted',           label: 'Order accepted',         icon: '✅', color: 'blue'   },
  { key: 'preparing',          label: 'Preparing your order',   icon: '👨‍🍳', color: 'orange' },
  { key: 'driver_assigned',    label: 'Driver on the way',      icon: '🛵', color: 'blue'   },
  { key: 'delivered',          label: 'Delivered!',             icon: '🎉', color: 'green'  },
];

const routes = {
  malabe:       { path: [[6.9097,79.9644],[6.9150,79.9572],[6.9200,79.9500],[6.9250,79.9450]], name: 'Malabe',       eta: 28 },
  athurugiriya: { path: [[6.8631,79.9772],[6.8680,79.9720],[6.8730,79.9670],[6.8780,79.9620]], name: 'Athurugiriya', eta: 22 },
  kaduwela:     { path: [[6.9357,79.9857],[6.9300,79.9800],[6.9250,79.9750],[6.9200,79.9700]], name: 'Kaduwela',     eta: 35 },
  battaramulla: { path: [[6.8964,79.9181],[6.9010,79.9130],[6.9060,79.9080],[6.9110,79.9030]], name: 'Battaramulla', eta: 20 },
  rajagiriya:   { path: [[6.9067,79.8947],[6.9110,79.8990],[6.9160,79.9040],[6.9210,79.9090]], name: 'Rajagiriya',   eta: 18 },
  borella:      { path: [[6.9304,79.8798],[6.9250,79.8840],[6.9200,79.8890],[6.9150,79.8940]], name: 'Borella',      eta: 15 },
};

// Re-centers map smoothly when driver moves
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

function nowTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

const DriverTracking = () => {
  const [stage, setStage]                         = useState(0);
  const [deliveryArea, setDeliveryArea]            = useState('malabe');
  const [progress, setProgress]                   = useState(0);
  const [currentLocation, setCurrentLocation]     = useState(routes.malabe.path[0]);
  const [isDelivered, setIsDelivered]              = useState(false);
  const [isPaused, setIsPaused]                   = useState(false);
  const [etaMin, setEtaMin]                       = useState(routes.malabe.eta);
  const [activityLog, setActivityLog]             = useState([
    { msg: 'Order placed — waiting for restaurant to accept', type: 'amber', time: nowTime() },
  ]);

  const stageTimerRef = useRef(null);

  const addLog = (msg, type = 'blue') => {
    setActivityLog(prev => [{ msg, type, time: nowTime() }, ...prev].slice(0, 10));
  };

  // ── Auto-advance stages 0 → 1 → 2 → 3 ──────────────────────
  useEffect(() => {
    if (stage === 0) {
      stageTimerRef.current = setTimeout(() => {
        setStage(1);
        addLog('Restaurant accepted your order ✓', 'green');
      }, 5000);
    }
    if (stage === 1) {
      stageTimerRef.current = setTimeout(() => {
        setStage(2);
        addLog('Kitchen started preparing your food 👨‍🍳', 'blue');
      }, 4000);
    }
    if (stage === 2) {
      stageTimerRef.current = setTimeout(() => {
        setStage(3);
        addLog('Driver Ravindu (WP-5821) assigned 🛵', 'blue');
        addLog('Driver is heading to pick up your order', 'blue');
      }, 6000);
    }
    return () => clearTimeout(stageTimerRef.current);
  }, [stage]);

  // ── ETA countdown (real-time) ────────────────────────────────
  useEffect(() => {
    if (stage < 3 || isDelivered) return;
    const t = setInterval(() => setEtaMin(p => Math.max(0, p - 1)), 60000);
    return () => clearInterval(t);
  }, [stage, isDelivered]);

  // ── Driver movement ──────────────────────────────────────────
  useEffect(() => {
    if (stage !== 3 || isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        const path = routes[deliveryArea].path;
        if (next >= path.length) {
          setIsDelivered(true);
          setStage(4);
          addLog('Order delivered successfully! 🎉', 'green');
          clearInterval(interval);
          return prev;
        }
        setCurrentLocation(path[next]);
        const remaining = path.length - 1 - next;
        setEtaMin(Math.round((remaining / (path.length - 1)) * routes[deliveryArea].eta));
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [stage, deliveryArea, isPaused]);

  const resetAll = () => {
    clearTimeout(stageTimerRef.current);
    setStage(0);
    setProgress(0);
    setIsDelivered(false);
    setIsPaused(false);
    setEtaMin(routes[deliveryArea].eta);
    setCurrentLocation(routes[deliveryArea].path[0]);
    setActivityLog([{ msg: 'Order placed — waiting for restaurant to accept', type: 'amber', time: nowTime() }]);
  };

  const handleAreaChange = (e) => {
    const key = e.target.value;
    setDeliveryArea(key);
    setProgress(0);
    setCurrentLocation(routes[key].path[0]);
    setEtaMin(routes[key].eta);
    setIsDelivered(false);
  };

  const pct = routes[deliveryArea].path.length > 1
    ? Math.round((progress / (routes[deliveryArea].path.length - 1)) * 100)
    : 0;

  const sc = {
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-800',  badge: 'bg-amber-100 text-amber-800'   },
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-800',   badge: 'bg-blue-100 text-blue-800'     },
    orange: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800' },
    green:  { bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-800',  badge: 'bg-green-100 text-green-800'   },
  }[STAGES[stage].color];

  const currentStage = STAGES[stage];

  return (
    <>
      <style>{`
        @keyframes ping    { 75%,100%{ transform:scale(2.2); opacity:0; } }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .log-item          { animation: fadeIn .3s ease; }
      `}</style>

      <Header />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* ── Top header ── */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Tracking</h2>
                <p className="text-sm text-gray-500 mt-0.5">Order #QB-4821 · Spicy Zinger Burger</p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${sc.badge} ${sc.border}`}>
                <span className="text-base">{currentStage.icon}</span>
                {currentStage.label}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center">
              {STAGES.map((s, i) => (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-500
                      ${i < stage  ? 'bg-green-500 border-green-500 text-white'
                      : i === stage ? `${sc.bg} ${sc.border} ${sc.text}`
                      : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                    >
                      {i < stage ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-1 text-center leading-tight hidden sm:block ${i === stage ? sc.text + ' font-medium' : 'text-gray-400'}`}
                      style={{ maxWidth: 60 }}>
                      {s.label}
                    </span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 transition-all duration-700 ${i < stage ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── STAGE 0: Waiting for restaurant ── */}
            {stage === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-5">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-60" />
                  <span className="absolute inset-3 rounded-full bg-amber-200 animate-ping opacity-40" style={{ animationDelay: '.35s' }} />
                  <span className="relative text-5xl">🍽️</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">Waiting for restaurant to accept your order</p>
                  <p className="text-sm text-gray-500 mt-1">This usually takes less than a minute…</p>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400"
                      style={{ animation: `ping 1.2s ease ${i * 0.25}s infinite` }} />
                  ))}
                </div>
                <button onClick={resetAll} className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline">
                  Cancel order
                </button>
              </div>
            )}

            {/* ── STAGE 1 & 2: Accepted / Preparing ── */}
            {(stage === 1 || stage === 2) && (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-50" />
                  <span className="relative text-5xl">{currentStage.icon}</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{currentStage.label}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stage === 1
                      ? 'Great news! The restaurant confirmed your order. Finding you a driver…'
                      : 'Your food is being freshly prepared. A driver will be assigned shortly.'}
                  </p>
                </div>

                {/* Restaurant summary card */}
                <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">🍔</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">QuickBite — {routes[deliveryArea].name}</p>
                    <p className="text-xs text-gray-500">Spicy Zinger Burger × 1</p>
                    <p className={`text-xs font-medium mt-0.5 ${stage === 1 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {stage === 1 ? 'Accepted ✓ — finding driver' : 'In kitchen 👨‍🍳'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800">~{routes[deliveryArea].eta} min</p>
                    <p className="text-xs text-gray-400">est. delivery</p>
                  </div>
                </div>

                {/* Activity log (early stages) */}
                <div className="w-full max-w-sm bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Updates</p>
                  <div className="flex flex-col gap-2">
                    {activityLog.map((l, i) => (
                      <div key={i} className="log-item flex items-start gap-2">
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          l.type === 'green' ? 'bg-green-500' : l.type === 'amber' ? 'bg-amber-400' : 'bg-blue-400'
                        }`} />
                        <span className="text-xs text-gray-600 flex-1">{l.msg}</span>
                        <span className="text-xs text-gray-400">{l.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={resetAll} className="text-xs text-gray-400 hover:text-gray-600 underline">
                  Cancel & restart
                </button>
              </div>
            )}

            {/* ── STAGES 3 & 4: Driver on the way / Delivered ── */}
            {stage >= 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ── Left panel ── */}
                  <div>
                    {/* Driver card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">RK</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">Ravindu Kumara</p>
                        <p className="text-xs text-gray-500">Honda CB150 · WP-5821</p>
                        <p className="text-xs text-amber-500 mt-0.5">★★★★★ 4.9 · 1,203 trips</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {isDelivered ? (
                          <span className="text-green-600 font-semibold text-sm">Arrived ✓</span>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-gray-800">{etaMin}</p>
                            <p className="text-xs text-gray-400">min away</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Area selector (disabled once driving) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Area</label>
                      <select
                        value={deliveryArea}
                        onChange={handleAreaChange}
                        disabled
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 bg-white"
                      >
                        {Object.entries(routes).map(([key, r]) => (
                          <option key={key} value={key}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {isDelivered ? 'Delivered 🎉' : 'In Transit'}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${isDelivered ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500">{pct}% complete</div>
                    </div>

                    {/* Pause / Reset */}
                    {!isDelivered && (
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => setIsPaused(p => !p)}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isPaused ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          onClick={resetAll}
                          className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    )}

                    {/* Activity log */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Activity</p>
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                        {activityLog.map((l, i) => (
                          <div key={i} className="log-item flex items-start gap-2">
                            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              l.type === 'green' ? 'bg-green-500' : l.type === 'amber' ? 'bg-amber-400' : 'bg-blue-400'
                            }`} />
                            <span className="text-xs text-gray-600 flex-1">{l.msg}</span>
                            <span className="text-xs text-gray-400 ml-auto">{l.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Map ── */}
                  <div className="h-80 md:h-full min-h-72 rounded-xl overflow-hidden shadow border border-gray-200">
                    <MapContainer center={currentLocation} zoom={14} className="h-full w-full" style={{ minHeight: 288 }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapUpdater center={currentLocation} />
                      {/* Driver marker */}
                      <Marker position={currentLocation}>
                        <Popup>Driver's current location</Popup>
                      </Marker>
                      {/* Destination marker */}
                      <Marker position={routes[deliveryArea].path[routes[deliveryArea].path.length - 1]}>
                        <Popup>Your delivery address</Popup>
                      </Marker>
                      {/* Full route (dashed) */}
                      <Polyline
                        positions={routes[deliveryArea].path}
                        color="#93c5fd"
                        weight={4}
                        dashArray="6 6"
                      />
                      {/* Travelled path (solid green) */}
                      {progress > 0 && (
                        <Polyline
                          positions={routes[deliveryArea].path.slice(0, progress + 1)}
                          color="#22c55e"
                          weight={4}
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>

                {/* ── Bottom details bar ── */}
                <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-800 text-sm mb-3">Delivery Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Area</p>
                      <p className="font-medium text-gray-800">{routes[deliveryArea].name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">ETA</p>
                      <p className="font-medium text-gray-800">{isDelivered ? 'Arrived ✓' : `${etaMin} min`}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Next stop</p>
                      <p className="font-medium text-gray-800 truncate">
                        {progress < routes[deliveryArea].path.length - 1
                          ? `${routes[deliveryArea].path[progress + 1][0].toFixed(4)}, ${routes[deliveryArea].path[progress + 1][1].toFixed(4)}`
                          : 'Destination reached'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <p className="font-medium text-gray-800">{currentStage.label}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DriverTracking;