import { useState, useRef, useEffect } from 'react';
import { bookPages } from './bookData'; // Import the book content
import './App.css'; // Import our styles

function App() {
  // State to track the current page index
  const [currentPage, setCurrentPage] = useState(0);
  // State to track audio playback
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ref to hold the <audio> element
  const audioRef = useRef(null);

  // Get the content for the current page
  const page = bookPages[currentPage];
  const totalPages = bookPages.length;

  // --- Audio Controls ---

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Effect to sync state if audio ends
  useEffect(() => {
    const audioEl = audioRef.current;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);
    
    // Clean up listeners
    return () => {
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
    };
  }, []);

  // --- Navigation Controls ---

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const goToHome = () => {
    setCurrentPage(0); // Go to the cover
  };

  // Handle selection from the dropdown
  const handleGoToPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  // --- Render ---

  return (
    <div className="app">
      {/* Audio Element (hidden) */}
      <audio 
        ref={audioRef}
        src="/audio/Howls Moving Castle.mp3" 
        loop 
      />

      {/* Main Controls Container */}
      <div className="controls-container">
        {/* Audio Controls */}
        <div className="audio-controls">
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="navigation-controls">
          <button onClick={goToHome} disabled={currentPage === 0}>
            Home
          </button>
          <button onClick={goToPrevPage} disabled={currentPage === 0}>
            &larr; Previous
          </button>
          
          {/* Go to Page Dropdown */}
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

      {/* Book Container */}
      <div className="book-container">
        {/* Page */}
        <div className={`page ${page.isCover ? 'cover' : ''} ${page.image ? 'with-image' : 'text-only'}`}>
          
          {/* Render Image if it exists */}
          {page.image && (
            <img src={page.image} alt={page.isCover ? "Book Cover" : `Illustration for page ${page.pageNum}`} className="page-image" />
          )}

          {/* Render Text */}
          <div className="page-text">
            {page.text.map((line, index) => {
              // Special styling for the WANTED poster text
              if (line === "WANTED" || line === "ROSE RUSTLERS") {
                return <h2 key={index} className="wanted-poster">{line}</h2>;
              }
              return <p key={index}>{line}</p>;
            })}
          </div>

          {/* Render Page Number */}
          {page.pageNum && (
            <span className="page-number">{page.pageNum}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;