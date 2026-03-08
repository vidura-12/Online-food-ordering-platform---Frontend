import { FaUserCircle, FaBell, FaInfoCircle } from 'react-icons/fa';
import Notifications from '../common/NotificationsRestaruarant';

const sampleNotifications = [
  { message: "New order placed 🍔" },
  { message: "Menu item updated 📝" },
  { message: "Payment received 💰" },
];

export default function TopbarRestaurants() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-semibold">
        Deliveroo <span className="font-bold" style={{ color: 'rgba(255,88,35,255)' }}>FOOD</span>
      </h1>

      <div className="flex items-center gap-6 text-xl text-gray-700 relative">
        <Notifications notifications={sampleNotifications} />
        <FaInfoCircle className="cursor-pointer" />
        <FaUserCircle className="cursor-pointer" />
      </div>
    </div>
  );
}
