'use client';

import { useState } from 'react';
import VerticalNavbar from '../components/VerticalNavbar'; // Adjust path based on your project
import ChatBox from '../components/ChatBox'; // Create this component

const ChatsPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="flex h-screen text-black">
      {/* Vertical Navbar */}
      <VerticalNavbar onUserClick={handleUserClick} />

      {/* Chat Box */}
      <div className="flex-1 p-6">
        {selectedUserId ? (
          <ChatBox recipientId={selectedUserId} />
        ) : (
          <p>Select a user to view the chat</p>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
