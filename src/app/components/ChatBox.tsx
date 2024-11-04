import { useState, useEffect } from 'react';

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  recipientId: string;
}

const ChatBox = ({ recipientId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Assuming you fetch/set the current user ID from cookies or a global store

  // Fetch messages between the current user and the selected recipient
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/?recipientId=${recipientId}`, {
          method: 'GET',
          credentials: 'include', // Pass cookies for authentication
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [recipientId]);

  // Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage) return;
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: recipientId,
          content: newMessage,
        }),
      });
  
      // Log response for debugging
      const responseBody = await response.text(); // Use text() for full response in case there's an error
      console.log('Response status:', response.status);
      console.log('Response body:', responseBody);
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const sentMessage = JSON.parse(responseBody); // Parsing after ensuring it's valid JSON
      // Add the new message to the chat without refetching
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-gray-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold">User Name</span> {/* Replace with actual username */}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 flex ${
              message.sender === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.sender === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-gray-200 p-4 flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
