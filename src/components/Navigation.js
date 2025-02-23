
// components/Navigation.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-orange-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          J K TRANSPORT
        </Link>
        
        <div className="space-x-4">
          {!user ? (
            <>
              <Link href="/login" className="hover:text-orange-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-orange-200">
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="hover:text-orange-200">
                  Admin Dashboard
                </Link>
              )}
              <span className="mx-2">|</span>
              <span>{user.username}</span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}