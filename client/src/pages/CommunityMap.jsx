import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import axios from 'axios'
import L from 'leaflet'

// Fix for default Leaflet marker icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function CommunityMap() {
  const [users, setUsers] = useState([])
  const [myLocation, setMyLocation] = useState(null) // [lat, lng]

// ... inside CommunityMap function ...

  useEffect(() => {
    // 1. Get My Location & SAVE IT to DB
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setMyLocation([lat, lng]);

        // --- NEW: Save to Database ---
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if(storedUser && storedUser.token) {
                const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
                await axios.put('https://velopola-a-time-banking-community.onrender.com/api/users/location', { lat, lng }, config);
                console.log("Location saved to DB! 📍");
            }
        } catch (err) {
            console.error("Failed to save location", err);
        }
      },
      () => {
        setMyLocation([28.6139, 77.2090]); // Default fallback
      }
    );

    // 2. Fetch Users (Now we will use their REAL location)
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://velopola-a-time-banking-community.onrender.com/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

// ... rest of the file (render logic) ...

  if (!myLocation) return <div className="text-forest text-center mt-20 font-bold">Locating you... 🌍</div>

  return (
    <div className="h-screen w-full relative">
        
      {/* Floating Header */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 p-4 rounded-xl shadow-xl border border-sand backdrop-blur-sm">
        <h1 className="text-2xl font-black text-forest">Community <span className="text-moss">Map</span></h1>
        <Link to="/dashboard" className="text-sm font-bold text-forest hover:text-moss underline">
            ← Back to Dashboard
        </Link>
      </div>

      {/* THE MAP */}
      <MapContainer center={myLocation} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
        
        {/* Map Skin (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* My Marker */}
        <Marker position={myLocation}>
          <Popup>
            <div className="text-center">
                <strong className="text-forest text-lg">You are here! 📍</strong>
            </div>
          </Popup>
        </Marker>

        {/* Other Users Markers (Randomized for Demo) */}
        {users.map((user) => {
            // Only show users who have saved a location
            if (user.location && user.location.lat && user.location.lng) {
                return (
                    <Marker key={user._id} position={[user.location.lat, user.location.lng]}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-forest text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {user.skillsOffered?.map(skill => (
                                        <span key={skill} className="bg-cream text-forest text-xs px-2 py-1 rounded border border-sand">{skill}</span>
                                    ))}
                                </div>
                                <button className="w-full bg-forest text-cream text-xs font-bold py-1 rounded hover:bg-moss">
                                    Request Swap
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )
            } else {
                return null; // Don't show users with no location
            }
        })}

      </MapContainer>
    </div>
  )
}

export default CommunityMap