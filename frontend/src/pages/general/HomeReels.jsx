import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function HomeReels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      // Auto-play the first video
      setTimeout(() => {
        if (videoRefs.current[0]) {
          videoRefs.current[0].play().catch(console.error);
        }
      }, 500);
    }
  }, [videos]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videos = await axios.get("http://localhost:3000/api/reels/")
      setTimeout(() => {
        setVideos(videos.data.reels);
        console.log(videos.data.reels);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const handleVideoClick = (index) => {
    if (activeVideo === index) {
      // Toggle play/pause for the active video
      const video = videoRefs.current[index];
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    // Implement like functionality
    console.log('Liked video:', id);
    setVideos(prev => prev.map(video => 
      video.id === id ? {...video, likes: video.likes + 1} : video
    ));
  };

  const handleSave = (id, e) => {
    e.stopPropagation();
    // Implement save functionality
    console.log('Saved video:', id);
    setVideos(prev => prev.map(video => 
      video.id === id ? {...video, saved: video.saved + 1} : video
    ));
  };

  const handleComment = (id, e) => {
    e.stopPropagation();
    // Implement comment functionality
    console.log('Comment on video:', id);
    setVideos(prev => prev.map(video => 
      video.id === id ? {...video, comments: video.comments + 1} : video
    ));
  };

  const handleVisitStore = (storeId, e) => {
    e.stopPropagation();
    if (!storeId) return;
    navigate(`/store/${storeId}`);
  };

  // Handle scroll events for changing active video
  const handleScroll = (e) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = container.clientHeight;
    const currentIndex = Math.round(scrollTop / videoHeight);
    
    if (currentIndex !== activeVideo) {
      // Pause the previous video
      if (videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo].pause();
      }
      
      setActiveVideo(currentIndex);
      
      // Play the new active video
      if (videoRefs.current[currentIndex]) {
        videoRefs.current[currentIndex].play().catch(console.error);
      }
    }
  };

  // Touch events for mobile dragging
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setScrollStart(containerRef.current.scrollTop);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const y = e.touches[0].clientY;
    const walk = (y - startY) * 2; // Scroll-fastness
    containerRef.current.scrollTop = scrollStart - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="reels-loading">
        <div className="loading-spinner">Loading delicious food videos...</div>
      </div>
    );
  }

  return (
    <div 
      className="reels-container"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {videos.map((v, index) => (
        <div 
          className={`reel-item ${activeVideo === index ? 'active' : ''}`} 
          key={index}
          onClick={() => handleVideoClick(v._id)}
        >
          <video 
            ref={el => videoRefs.current[index] = el}
            className="reel-video" 
            src={v.videoUrl} 
            playsInline 
            muted 
            loop 
            preload="auto"
          />
          {console.log(v.videoUrl)}
          {/* Video overlay with user info and description */}
          <div className="reel-overlay">
            <div className="user-info">
              <div className="user-avatar">🍔</div>
              <div className="user-name">{v.foodPartner?.businessName || v.title}</div>
            </div>
            <div className="reel-desc">{v.description}</div>
            <button 
              className="visit-store-btn" 
              onClick={(e) => handleVisitStore(v.foodPartner._id, e)}
            >
              Visit Store
            </button>
          </div>
          
          {/* Right side action buttons with glassmorphism effect */}
          <div className="reel-actions">
            <div className="action-btn" onClick={(e) => handleLike(v._id, e)}>
              <div className="action-icon">❤️</div>
              <span className="action-count">100</span>
            </div>
            <div className="action-btn" onClick={(e) => handleComment(v._id, e)}>
              <div className="action-icon">💬</div>
              <span className="action-count">21</span>
            </div>
            <div className="action-btn" onClick={(e) => handleSave(v._id, e)}>
              <div className="action-icon">🔖</div>
              <span className="action-count">5</span>
            </div>
            <div className="action-btn">
              <div className="action-icon">↗️</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
