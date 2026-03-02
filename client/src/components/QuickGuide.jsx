import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MousePointer2 } from 'lucide-react';

const QuickGuide = () => {
  // Check local storage to see if user has already dismissed the guide
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenVelopolaGuide');
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenVelopolaGuide', 'true');
  };

  if (!isVisible) return null;

  const guideNotes = [
    {
      title: "The Vision",
      desc: "Velopola isn't just a site; it's a community built on equality where 1 hour of work always equals 1 credit.",
      img: "/guide/hero-view.png",
      pos: "top-12 left-10",
      rotate: -3
    },
    {
      title: "Community Garden",
      desc: "A transparent directory where HR can see real-time skill availability and peer-to-peer connection requests.",
      img: "/guide/garden-view.png",
      pos: "top-20 right-12",
      rotate: 2
    },
    {
      title: "Geo-Location Hub",
      desc: "Our interactive map visualizes the community network, allowing for hyper-local resource sharing.",
      img: "/guide/map-view.png",
      pos: "bottom-16 left-1/4",
      rotate: -1
    },
    {
      title: "Operational Control",
      desc: "A mature dashboard for users to manage tasks, track time-credits, and handle secure swap requests.",
      img: "/guide/dashboard-view.png",
      pos: "bottom-10 right-10",
      rotate: 4
    }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDismiss} 
        className="fixed inset-0 z-[9999] bg-white/10 backdrop-blur-xl flex items-center justify-center cursor-crosshair"
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h2 className="text-forest text-4xl font-black tracking-tighter mb-2">Platform Walkthrough</h2>
          <p className="text-forest/60 font-bold flex items-center justify-center gap-2">
            <MousePointer2 size={18}/> CLICK ANYWHERE TO START EXPLORING
          </p>
        </div>

        <div className="relative w-full h-full max-w-screen-2xl mx-auto pointer-events-none">
          {guideNotes.map((note, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: [0, -15, 0], opacity: 1, rotate: note.rotate }}
              transition={{ delay: index * 0.1, y: { repeat: Infinity, duration: 5, ease: "easeInOut" }}}
              className={`absolute ${note.pos} w-80 bg-white p-5 shadow-2xl rounded-sm border-t-[25px] border-forest/5 pointer-events-auto`}
            >
              <div className="relative group overflow-hidden rounded-lg mb-4 border border-gray-100 aspect-video">
                <img src={note.img} alt={note.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-lg font-black text-forest flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-moss"/> {note.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{note.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickGuide;