import { useState } from 'react';

function Driver() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DRIVER'
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/drivers/login' : '/api/drivers/register';
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (isLogin) {
        localStorage.setItem('driverToken', data.token);
        localStorage.setItem('driverInfo', JSON.stringify(data.driver));
        window.location.href = '/dashboard';
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchOrders = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deliveries/driver/${driverId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
        }
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders');
    }
  };

  return (
    <div className="driver-container">
      {error && <div className="error">{error}</div>}
      
      {!localStorage.getItem('driverToken') ? (
        <div className="auth-form">
          <h2>{isLogin ? 'Driver Login' : 'Driver Registration'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </button>
        </div>
      ) : (
        <div className="orders-list">
          <h2>Assigned Orders</h2>
          {orders.length === 0 ? (
            <p>No orders assigned yet.</p>
          ) : (
            <ul>
              {orders.map(order => (
                <li key={order._id}>
                  <h3>Order #{order._id}</h3>
                  <p>Customer: {order.customerName}</p>
                  <p>Address: {order.address}</p>
                  <p>Status: {order.status}</p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => {
            localStorage.removeItem('driverToken');
            setOrders([]);
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Driver;