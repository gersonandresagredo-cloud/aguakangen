import { UIProvider } from './lib/UIContext';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import RainCanvas from './components/RainCanvas';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Benefits from './components/Benefits';
import Products from './components/Products';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';
import LegalModal from './components/LegalModal';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <UIProvider>
      <div className="relative w-full overflow-hidden">
        <ScrollProgress />
        <CustomCursor />
        <RainCanvas />

        <Hero />
        <Marquee />
        <Problem />
        <Solution />
        <Benefits />
        <Products />
        <About />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />

        <VideoModal />
        <LegalModal />
        <ChatWidget />
      </div>
    </UIProvider>
  );
}
