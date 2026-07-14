import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../lib/UIContext';

const STORAGE_KEY = 'kangen-demo-pos';

export default function VideoModal() {
  const { videoOpen, closeVideo } = useUI();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      try {
        const t = parseFloat(localStorage.getItem(STORAGE_KEY));
        if (t > 0 && t < v.duration - 2) v.currentTime = t;
      } catch { /* almacenamiento no disponible */ }
    };
    const onTime = () => {
      try { localStorage.setItem(STORAGE_KEY, String(v.currentTime)); } catch { /* almacenamiento no disponible */ }
    };
    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    return () => {
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
    };
  }, [videoOpen]);

  return (
    <AnimatePresence>
      {videoOpen && (
        <motion.div
          onClick={closeVideo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1500] flex items-center justify-center p-[clamp(14px,4vw,48px)]"
          style={{ background: 'rgba(4,10,12,.82)', backdropFilter: 'blur(18px)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(980px,100%)] rounded-3xl overflow-hidden border border-aqua-glow/25 bg-black"
            style={{ boxShadow: '0 0 90px rgba(28,169,201,.35), 0 40px 100px rgba(0,0,0,.6)' }}
          >
            <video
              ref={videoRef}
              src="/assets/demo.mp4"
              controls
              autoPlay
              playsInline
              className="block w-full h-auto"
              style={{ maxHeight: '80vh' }}
            />
            <button
              onClick={closeVideo}
              data-cursor="hover"
              className="absolute top-3.5 right-3.5 w-[38px] h-[38px] rounded-full border border-white/20 flex items-center justify-center cursor-pointer text-white"
              style={{ background: 'rgba(7,16,19,.7)', backdropFilter: 'blur(10px)' }}
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
