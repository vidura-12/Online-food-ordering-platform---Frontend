import { useState, useEffect } from 'react';

function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [driverInfo, setDriverInfo] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const useFakeData = true;
  
  const fakeOrders = [
    {
      _id: 'ORD-10001',
      status: 'Assigned',
      customerName: 'Mr. Amal Perera',
      address: 'No. 45, Temple Road',
      city: 'Colombo',
      items: [
        { name: 'Chicken Biryani' },
        { name: 'Mango Lassi' }
      ]
    },
    {
      _id: 'ORD-10002',
      status: 'On the Way',
      customerName: 'Ms. Nadeesha Fernando',
      address: 'Apartment 7B, Ocean Heights',
      city: 'Negombo',
      items: [
        { name: 'Seafood Pizza' },
        { name: 'Garlic Bread' }
      ]
    },
    {
      _id: 'ORD-10003',
      status: 'Delivered',
      customerName: 'Dr. Kusal Jayasinghe',
      address: '12, Lake View Drive',
      city: 'Kandy',
      items: [
        { name: 'Vegan Salad' },
        { name: 'Green Smoothie' }
      ]
    },
    {
      _id: 'ORD-10004',
      status: 'Cancelled',
      customerName: 'Mrs. Tharushi Madushani',
      address: '19, Flower Road',
      city: 'Galle',
      items: [
        { name: 'Egg Fried Rice' }
      ]
    },
    {
      _id: 'ORD-10005',
      status: 'Assigned',
      customerName: 'Mr. Dilan Senanayake',
      address: '33, Palm Grove',
      city: 'Matara',
      items: [
        { name: 'Grilled Chicken Wrap' },
        { name: 'Iced Tea' }
      ]
    }
  ];
  
  
  const fakeDriverInfo = {
    id: 'DRV-9001',
    name: 'Kasun Abeywickrama',
    deliveryCities: ['Colombo', 'Kandy', 'Negombo', 'Galle', 'Matara']
  };
  


  useEffect(() => {
    const driverId = JSON.parse(localStorage.getItem('driverInfo'))?.id;
  
    if (useFakeData) {
      setDriverInfo(fakeDriverInfo);
      setOrders(fakeOrders);
    } else if (driverId) {
      fetchOrders(driverId);
      fetchDriverInfo(driverId);
    }
  }, []);
  
  

  useEffect(() => {
    if (orders.length > 0) {
      const active = orders.filter(order => order.status === "On the Way");
      setActiveOrders(active);
      
      const pending = orders.filter(order => order.status === "Assigned");
      setPendingOrders(pending);
      
      const completed = orders.filter(order => 
        order.status === "Delivered" || order.status === "Rejected"
      );
      setCompletedOrders(completed);
    }
  }, [orders]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('driverToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchOrders = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deliveries/driver/${driverId}/all`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError('Error fetching orders: ' + err.message);
    }
  };

  const fetchDriverInfo = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/drivers/${driverId}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch driver information');
      }
      
      const data = await response.json();
      setDriverInfo(data);
    } catch (err) {
      console.error("Error fetching driver info:", err);
      setError('Error fetching driver information: ' + err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('http://localhost:3000/api/deliveries/status', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          deliveryId: orderId,
          status: newStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const driverId = JSON.parse(localStorage.getItem('driverInfo'))?.id;
      fetchOrders(driverId);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError('Error updating order status: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverInfo');
    window.location.href = '/';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-400',
      'Assigned': 'bg-cyan-500',
      'On the Way': 'bg-green-500',
      'Delivered': 'bg-gray-500',
      'Rejected': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const OrderCard = ({ order, showActions = true }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
        <span 
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}
        >
          {order.status}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-gray-700"><span className="font-medium">Customer:</span> {order.customerName}</p>
        <p className="text-gray-700"><span className="font-medium">Address:</span> {order.address}</p>
        <p className="text-gray-700"><span className="font-medium">City:</span> {order.city}</p>
        <p className="text-gray-700"><span className="font-medium">Items:</span> {order.items?.length || 0}</p>
      </div>
      {showActions && order.status !== 'Delivered' && order.status !== 'Rejected' && (
        <div className="p-4 bg-gray-50 flex flex-wrap gap-2">
          {order.status !== 'On the Way' && (
            <button 
              onClick={() => updateOrderStatus(order._id, 'On the Way')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Start Delivery
            </button>
          )}
          <button 
            onClick={() => updateOrderStatus(order._id, 'Delivered')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Mark Delivered
          </button>
          <button 
            onClick={() => updateOrderStatus(order._id, 'Rejected')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reject Order
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            {driverInfo && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Welcome, <span className="font-medium">{driverInfo.name}</span></p>
                <p>Delivery Cities: <span className="font-medium">{driverInfo.deliveryCities?.join(', ')}</span></p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        {/* New Assignments Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">New Assignments</h2>
          {pendingOrders.length === 0 ? (
            <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
              No new assignments.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
        
        {/* Active Deliveries Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">In Progress</h2>
          {activeOrders.length === 0 ? (
            <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
              No active deliveries.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
        
        {/* Completed Orders Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Past Orders</h2>
          {completedOrders.length === 0 ? (
            <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
              No completed orders.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOrders.map(order => (
                <OrderCard key={order._id} order={order} showActions={false} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;