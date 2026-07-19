/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-150/40 text-blue-600 dark:text-blue-500">
            <BrainCircuit className="h-8 w-8 animate-pulse" />
          </div>
        </div>
        <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
          The requested page could not be located in our interview assessment mainframe. It may have been relocated or deleted.
        </p>
        <div className="mt-8">
          <Link
            id="notfound-home-btn"
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Safety
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
