'use client';

import { motion } from 'framer-motion';

interface UserTitleProps {
  username: string;
}

export default function UserTitle({ username }: UserTitleProps) {
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