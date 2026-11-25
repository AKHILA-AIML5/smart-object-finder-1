import { useState, useRef, useEffect } from "react";
import {
  Camera, Search, Mic, Home, History, Package,
  Settings, MapPin, Clock, Scan, X
} from "lucide-react";
import "./App.css";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);

  const [objects] = useState([
    { name: "Keys", room: "Bedroom", place: "Near study table", time: "10 minutes ago", icon: "🔑" },
    { name: "Water Bottle", room: "Living Room", place: "On the sofa", time: "1 hour ago", icon: "🧴" },
    { name: "Laptop Charger", room: "Study Room", place: "Beside laptop", time: "Yesterday", icon: "🔌" }
  ]);

  const filteredObjects = objects.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      setStream(media);
      setMessage("Camera is active. Scan your room.");
    } catch {
      setMessage("Camera permission denied or camera unavailable.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setMessage("Camera stopped.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas.getContext("2d").drawImage(
      videoRef.current, 0, 0, canvas.width, canvas.height
    );

    setPhoto(canvas.toDataURL("image/jpeg"));
    setMessage("Photo captured successfully!");
  };

  const navigation = [
    { name: "Dashboard", icon: <Home /> },
    { name: "Scan Room", icon: <Camera /> },
    { name: "Object Memory", icon: <Package /> },
    { name: "Scan History", icon: <History /> },
    { name: "Settings", icon: <Settings /> }
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🔍 SmartFinder</h2>
        <p className="menu-title">MAIN MENU</p>

        {navigation.map(item => (
          <button
            key={item.name}
            className={page === item.name ? "nav active" : "nav"}
            onClick={() => setPage(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}

        <div className="sidebar-footer">
          <strong>Smart Object Finder</strong>
          <small>AI Powered Object Memory</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Find your things easily with SmartFinder.</p>
          </div>
          <div className="profile">👤</div>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <h2>Welcome to SmartFinder!</h2>
                <p>Scan your room, remember your objects and find them anytime.</p>
              </div>
              <button className="primary-btn" onClick={() => setPage("Scan Room")}>
                <Camera size={18} /> Start Scanning
              </button>
            </section>

            <section className="stats">
              <div className="stat-card">
                <Package />
                <h2>{objects.length}</h2>
                <p>Saved Objects</p>
              </div>
              <div className="stat-card">
                <Home />
                <h2>03</h2>
                <p>Rooms</p>
              </div>
              <div className="stat-card">
                <Scan />
                <h2>05</h2>
                <p>Total Scans</p>
              </div>
            </section>

            <section className="search-section">
              <h2>Find Your Object</h2>
              <p>Search for an object in your saved memory.</p>
              <div className="search-box">
                <Search />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Where are my keys?"
                />
              </div>
            </section>

            <section className="memory-section">
              <h2>Recently Remembered Objects</h2>
              <div className="object-grid">
                {filteredObjects.map(item => (
                  <ObjectCard key={item.name} item={item} />
                ))}
                {filteredObjects.length === 0 && (
                  <p>No matching objects found.</p>
                )}
              </div>
            </section>
          </>
        )}

        {page === "Scan Room" && (
          <section className="content-card">
            <h2><Camera /> Room Scanner</h2>
            <p>Move around your room and capture multiple views.</p>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-preview"
            />

            <p className="status">{message || "Camera is not started."}</p>

            <div className="camera-buttons">
              <button className="primary-btn" onClick={startCamera}>
                <Camera size={18} /> Start Camera
              </button>
              <button
                className="primary-btn"
                onClick={capturePhoto}
                disabled={!stream}
              >
                <Scan size={18} /> Capture Photo
              </button>
              <button className="stop-btn" onClick={stopCamera}>
                <X size={18} /> Stop Camera
              </button>
            </div>

            {photo && (
              <div className="captured">
                <h3>Captured Photo</h3>
                <img src={photo} alt="Captured room" />
              </div>
            )}
          </section>
        )}

        {page === "Object Memory" && (
          <section className="memory-section">
            <h2>All Saved Objects</h2>
            <div className="object-grid">
              {objects.map(item => (
                <ObjectCard key={item.name} item={item} />
              ))}
            </div>
          </section>
        )}

        {page === "Scan History" && (
          <section className="content-card">
            <History size={35} />
            <h2>Scan History</h2>
            <p>Room scanning history will appear here.</p>
          </section>
        )}

        {page === "Settings" && (
          <section className="content-card">
            <Settings size={35} />
            <h2>Settings</h2>
            <p>Account, camera and privacy settings will be added here.</p>
          </section>
        )}

        <footer>SmartFinder © 2026 | AI Powered Object Finder</footer>
      </main>
    </div>
  );
}

function ObjectCard({ item }) {
  return (
    <div className="object-card">
      <div className="object-icon">{item.icon}</div>
      <h3>{item.name}</h3>
      <p><MapPin size={15} /> {item.room}</p>
      <p className="position">{item.place}</p>
      <small><Clock size={13} /> {item.time}</small>
    </div>
  );
}

export default App;
