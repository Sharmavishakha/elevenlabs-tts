import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fix: wait for client-side hydration before using localStorage
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      if (user) {
        router.push('/');
      } else {
        setCheckingAuth(false);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = { email, username };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    router.push('/');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
