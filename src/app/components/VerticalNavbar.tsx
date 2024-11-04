'use client'
import { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Profile and Logout icons
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
}

const VerticalNavbar = ({ onUserClick }: { onUserClick: (userId: string) => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // For redirecting after logout

  useEffect(() => {
    // Fetching users the current user has interacted with
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/chat/Chats', {
          method: 'GET',
          credentials: 'include', // Include cookies (for authentication token)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log(data);
        setUsers(data.users); // Assuming response contains a 'users' array
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Remove token cookie and redirect to home page
    Cookies.remove('token');
    router.push('/');
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 h-screen bg-gray-800 p-4 flex flex-col justify-between text-white">
      {/* Top Section: Chats and Search */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Chats</h2>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 p-2 rounded mb-4">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 bg-transparent text-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List of Users */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="p-3 bg-gray-700 shadow-md rounded cursor-pointer hover:bg-gray-600 transition-all duration-200"
              onClick={() => onUserClick(user._id)}
            >
              <p className="font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Profile and Logout */}
      <div className="flex flex-col items-center space-y-4">
        <FaUserCircle className="text-4xl hover:text-gray-500 cursor-pointer transition-all duration-200" />
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 p-2 rounded shadow-md hover:bg-red-400 transition-all duration-200"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default VerticalNavbar;
