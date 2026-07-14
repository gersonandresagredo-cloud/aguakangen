import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(null); // null | 'aviso' | 'privacidad'

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen((v) => !v), []);

  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  const openLegal = useCallback((type) => setLegalOpen(type), []);
  const closeLegal = useCallback(() => setLegalOpen(null), []);

  const value = useMemo(
    () => ({
      chatOpen, openChat, closeChat, toggleChat,
      videoOpen, openVideo, closeVideo,
      legalOpen, openLegal, closeLegal,
    }),
    [chatOpen, videoOpen, legalOpen, openChat, closeChat, toggleChat, openVideo, closeVideo, openLegal, closeLegal]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <UIProvider>');
  return ctx;
}
