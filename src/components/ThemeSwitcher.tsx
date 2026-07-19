/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
      aria-label="Toggle Theme Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 m-auto h-5 w-5 flex items-center justify-center"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="h-5 w-5 flex items-center justify-center"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </button>
  );
}
