import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  
  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`);
      setFlights(res.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = flights.length;
  const delayed = flights.filter(f => f.status === 'DELAYED').length;
  const onTime = flights.filter(f => f.status === 'ON_TIME' || !f.status).length;
  const completed = flights.filter(f => f.status === 'COMPLETED').length;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(197, 168, 128, 0.1)', borderRadius: '50%', color: 'var(--color-gold)' }}>
            <Plane size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>{total}</p>
          </div>
        </div>
        
        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(56, 102, 65, 0.1)', borderRadius: '50%', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>On Time</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>{onTime}</p>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(158, 42, 43, 0.1)', borderRadius: '50%', color: 'var(--color-danger)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Delayed</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>{delayed}</p>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(197, 168, 128, 0.1)', borderRadius: '50%', color: 'var(--color-gold)' }}>
            <Plane size={24} style={{transform: 'rotate(90deg)'}} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Completed</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>{completed}</p>
          </div>
        </div>
      </div>

      <div className="premium-card">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gold)' }}>Active Flights Schedule</h3>
        {flights.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No flights scheduled yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="premium-table" style={{ minWidth: '700px' }}>
              <thead>
              <tr>
                <th>Flight ID</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.flightId}>
                  <td style={{ fontWeight: '500' }}>{flight.flightId}</td>
                  <td>{flight.source} &rarr; {flight.destination}</td>
                  <td>{new Date(flight.departureTime).toLocaleString()}</td>
                  <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td>{flight.priority}</td>
                  <td>
                    <span className={`status-badge status-${flight.status?.toLowerCase() || 'on_time'}`}>
                      {flight.status || 'ON_TIME'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
