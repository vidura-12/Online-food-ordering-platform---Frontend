import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DriverAuth({ isLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    deliveryCities: [''],
  });

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      deliveryCities: [''],
    });
    
  }, [isLogin]);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/drivers/login' : '/api/drivers/register';

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (isLogin) {
        localStorage.setItem('driverToken', data.token);
        localStorage.setItem('driverInfo', JSON.stringify(data.driver));
        navigate('/driverDashboard');
      } else {
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCityChange = (index, value) => {
    const updatedCities = [...formData.deliveryCities];
    updatedCities[index] = value;
    setFormData({ ...formData, deliveryCities: updatedCities });
  };

  const addCity = () => {
    setFormData({ ...formData, deliveryCities: [...formData.deliveryCities, ''] });
  };

  const removeCity = (index) => {
    const updatedCities = formData.deliveryCities.filter((_, i) => i !== index);
    setFormData({ ...formData, deliveryCities: updatedCities });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {isLogin ? 'Driver Login' : 'Driver Registration'}
        </h2>

        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Cities</label>
                {formData.deliveryCities.map((city, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleCityChange(index, e.target.value)}
                      placeholder="Enter city"
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {formData.deliveryCities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCity(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCity}
                  className="text-sm text-black hover:underline"
                >
                  + Add Another City
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to={isLogin ? '/driverRegister' : '/driverLogin'}
            className="text-sm text-black hover:underline"
          >
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DriverAuth;
