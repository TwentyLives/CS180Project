'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function UserTitle() {
  const [username, setUsername] = useState<string>('User');

  useEffect(() => {
    // Helper to get token from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    if (token) {
      fetch('http://127.0.0.1:8000/api/userinfo/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) setUsername(data.username);
        })
        .catch(() => setUsername('User'));
    }
  }, []);

  const isLong = username.length > 10;

  return (
    <div className="flex flex-col justify-center items-start leading-tight max-w-full">
      {/* Welcome */}
      <motion.span
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-medium sm:text-lg md:text-xl font-extralight italic tracking-normal mb-0.5"
      >
        Welcome back,
      </motion.span>

      {/* Username */}
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.15em', scale: 0.95 }}
        animate={{ opacity: 1, letterSpacing: '0em', scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        className={`flex flex-wrap ${isLong ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-medium tracking-tight leading-none break-words max-w-[90vw]`}
      >
        {username.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 + index * 0.04 }}
            className="whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}