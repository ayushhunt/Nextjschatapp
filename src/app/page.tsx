'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("Mounting")
    const token = Cookies.get('token');
    console.log(token)
    if (token) {
      router.push('/chats'); // Redirect to chats page if token exists
    }
  }, [router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/register');
  };

  return (
    <div className="flex flex-col text-black items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Chat App</h1>
      <p className="mb-6">Please log in or sign up to continue.</p>
      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={handleSignup}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HomePage;
