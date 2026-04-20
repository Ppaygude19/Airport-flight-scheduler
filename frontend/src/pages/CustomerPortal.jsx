import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, ArrowRight, Clock } from 'lucide-react';
import RouteMap from '../components/RouteMap';

const API_URL = 'http://localhost:8080/api';

export default function CustomerPortal() {
  const [flights, setFlights] = useState([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', seatType: 'Economy' });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`);
      // Filter out completed and cancelled for the public board
      const activeFlights = res.data.filter(f => f.status !== 'COMPLETED' && f.status !== 'CANCELLED');
      setFlights(activeFlights);
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setIsLoadingFlights(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRouteSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/routes?source=${source.toUpperCase()}&dest=${dest.toUpperCase()}`);
      if (res.data.totalWeight === -1) {
        setError('No route found between these airports.');
        setRouteData(null);
      } else {
        setRouteData(res.data);
        setError('');
      }
    } catch (err) {
      setError('Error fetching route. Ensure backend is running.');
      setRouteData(null);
    }
  };

  const handleBookClick = (flightId) => {
    setSelectedFlight(flightId);
    setShowModal(true);
    setBookingSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      const payload = { ...bookingForm, flightId: selectedFlight };
      const res = await axios.post(`${API_URL}/bookings`, payload);
      setBookingSuccess(`Success! Your Booking ID is ${res.data.bookingId}`);
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      setBookingSuccess('Error making booking.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '2rem 4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
          <Plane size={32} />
          AeroTravel.
        </h1>
        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <Clock size={16} />
          Live Departures & Arrivals
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '0 4rem 4rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem 2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
          <h2 style={{ position: 'relative', zIndex: 1, fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: '1rem', background: 'linear-gradient(to right, #FFFFFF, var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elevate Your Journey.
          </h2>
          <p style={{ position: 'relative', zIndex: 1, fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            Experience the future of flight scheduling. Real-time updates, intelligent routing, and seamless bookings—all in one place.
          </p>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>24/7</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>100%</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Uptime Reliability</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>&lt;1ms</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Route Calculation</div>
            </div>
          </div>
        </section>

        {/* Route Planner */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', position: 'relative', zIndex: 2 }}>
          <div className="premium-card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Trip Planner</h2>
            <form onSubmit={handleRouteSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label className="premium-label">From</label>
                <input type="text" className="premium-input" value={source} onChange={e => setSource(e.target.value)} placeholder="JFK" required />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label className="premium-label">To</label>
                <input type="text" className="premium-input" value={dest} onChange={e => setDest(e.target.value)} placeholder="LAX" required />
              </div>
              <button type="submit" className="premium-btn" style={{ height: '48px', width: '100%' }}>Search Route</button>
            </form>
          </div>

          <div>
            {error && (
              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                {error}
              </div>
            )}

            {routeData && (
              <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Fastest Route Discovered</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {routeData.path.map((node, index) => (
                    <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{node}</span>
                      {index < routeData.path.length - 1 && <ArrowRight color="var(--color-primary)" size={16} />}
                    </div>
                  ))}
                </div>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                  Estimated Travel Time: <span style={{ color: 'var(--color-text-main)', fontWeight: '600', fontSize: '1.1rem' }}>{routeData.totalWeight} minutes</span>
                </p>
                <div style={{ flex: 1, minHeight: '300px' }}>
                  <RouteMap routePath={routeData.path} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Departures Board */}
        <section style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
            Flight Status Board
          </h2>
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            {isLoadingFlights ? (
              <div style={{ padding: '2.5rem' }}>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '3rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '3rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '3rem' }}></div>
              </div>
            ) : flights.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>No active flights scheduled at the moment.</p>
            ) : (
              <div className="table-responsive">
                <table className="premium-table" style={{ width: '100%', margin: 0, minWidth: '700px' }}>
                  <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <tr>
                    <th style={{ padding: '1.5rem' }}>Flight</th>
                    <th style={{ padding: '1.5rem' }}>Route</th>
                    <th style={{ padding: '1.5rem' }}>Time</th>
                    <th style={{ padding: '1.5rem' }}>Status</th>
                    <th style={{ padding: '1.5rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.flightId}>
                      <td style={{ fontWeight: '600', color: 'var(--color-primary)', fontSize: '1.2rem', padding: '1.5rem' }}>{flight.flightId}</td>
                      <td style={{ fontSize: '1.1rem', padding: '1.5rem' }}>{flight.source} &rarr; {flight.destination}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span>{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        {flight.status === 'DELAYED' ? (
                          <span style={{ color: 'var(--color-danger)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', boxShadow: '0 0 8px var(--color-danger)' }} />
                            DELAYED
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
                            ON TIME
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <button className="premium-btn-outline" onClick={() => handleBookClick(flight.flightId)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                          Book Seat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        <p>&copy; 2024 AeroTravel Scheduling System.</p>
        <Link to="/admin" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginTop: '1rem', display: 'inline-block', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.7}>Staff Login</Link>
      </footer>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !bookingSuccess && setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Book Flight {selectedFlight}</h3>
            {bookingSuccess ? (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
                {bookingSuccess}
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label className="premium-label">Full Name</label>
                  <input type="text" className="premium-input" value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} required />
                </div>
                <div>
                  <label className="premium-label">Email Address</label>
                  <input type="email" className="premium-input" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} required />
                </div>
                <div>
                  <label className="premium-label">Seat Class</label>
                  <select className="premium-input" value={bookingForm.seatType} onChange={e => setBookingForm({...bookingForm, seatType: e.target.value})} style={{ appearance: 'none', backgroundColor: '#000', color: 'var(--color-text-main)' }}>
                    <option value="Economy">Economy Class</option>
                    <option value="Business">Business Class</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="premium-btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="premium-btn" style={{ flex: 1, opacity: isBooking ? 0.7 : 1, cursor: isBooking ? 'not-allowed' : 'pointer' }} disabled={isBooking}>
                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
