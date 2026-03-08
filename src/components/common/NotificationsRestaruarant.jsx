import { useState, useRef, useEffect } from 'react';

export default function Notifications({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 text-2xl hover:text-black transition"
      >
        🛎️
      </button>

      {/* Notification Box */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No new notifications.</div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((notif, i) => (
                <li
                  key={i}
                  className="p-4 text-sm text-gray-700 border-b hover:bg-gray-50 transition"
                >
                  {notif.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
