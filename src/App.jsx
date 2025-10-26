import { useState, useRef, useEffect } from 'react';
// --- Add motion imports ---
import { motion, AnimatePresence } from 'framer-motion';
import { bookPages } from './bookData';
import './App.css';

// --- Define the animation variants ---
// These variants describe the animation states for our page
const pageVariants = {
  // state for a new page entering
  initial: (direction) => ({
    x: direction > 0 ? '100%' : '-100%', // Come in from right (if next) or left (if prev)
    opacity: 0,
  }),
  // state for the page being active
  animate: {
    x: '0%', // Animate to center
    opacity: 1,
    transition: { type: 'tween', ease: 'easeInOut', duration: 0.5 }
  },
  // state for an old page exiting
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%', // Exit to left (if next) or right (if prev)
    opacity: 0,
    transition: { type: 'tween', ease: 'easeInOut', duration: 0.5 }
  })
};


function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --- Add new state to track animation direction ---
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const audioRef = useRef(null);
  const page = bookPages[currentPage];
  const totalPages = bookPages.length;

  // --- Audio Controls (UNCHANGED) ---
  const togglePlayPause = () => {
    // This is your existing function. We are not changing it.
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // This is your existing effect. We are not changing it.
    const audioEl = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);
    return () => {
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
    };
  }, []);

  // --- Navigation Controls (UPDATED) ---
  // We just add one line to each function to set the animation direction

  const goToNextPage = () => {
    setDirection(1); // Set direction to "next"
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setDirection(-1); // Set direction to "previous"
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const goToHome = () => {
    setDirection(-1); // Going to page 0 is "previous"
    setCurrentPage(0);
  };

  const handleGoToPage = (e) => {
    const newPage = Number(e.target.value);
    setDirection(newPage > currentPage ? 1 : -1); // Set direction based on new page
    setCurrentPage(newPage);
  };

  // --- Render (UPDATED) ---

  return (
    <div className="app">
      <audio 
        ref={audioRef}
        src="/audio/Howls Moving Castle.mp3" 
        loop 
      />

      <div className="controls-container">
        <div className="audio-controls">
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </button>
        </div>
        <div className="navigation-controls">
          <button onClick={goToHome} disabled={currentPage === 0}>
            Home
          </button>
          <button onClick={goToPrevPage} disabled={currentPage === 0}>
            &larr; Previous
          </button>
          
          <select value={currentPage} onChange={handleGoToPage}>
            {bookPages.map((page, index) => (
              <option key={index} value={index}>
                {page.isCover ? 'Cover' : `Page ${page.pageNum}`}
              </option>
            ))}
          </select>
          
          <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
            Next &rarr;
          </button>
        </div>
      </div>

      {/* --- Book Container (UPDATED) --- */}
      <div className="book-container">
        {/* AnimatePresence handles the exit animation.
          mode="wait" makes it wait for the old page to exit before the new one enters.
          custom={direction} passes our direction state to the variants.
        */}
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          {/* This motion.div is our new animated page.
            The key={currentPage} is crucial for AnimatePresence to detect the change.
          */}
          <motion.div
            key={currentPage}
            className={`page ${page.isCover ? 'cover' : ''} ${page.image ? 'with-image' : 'text-only'}`}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction} // This passes the 'direction' to our variants
          >
            
            {page.image && (
              <img src={page.image} alt={page.isCover ? "Book Cover" : `Illustration for page ${page.pageNum}`} className="page-image" />
            )}

            <div className="page-text">
              {page.text.map((line, index) => {
                if (line === "WANTED" || line === "ROSE RUSTLERS") {
                  return <h2 key={index} className="wanted-poster">{line}</h2>;
                }
                return <p key={index}>{line}</p>;
              })}
            </div>

            {page.pageNum && (
              <span className="page-number">{page.pageNum}</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;