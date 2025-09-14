import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
          // { 
          //   id: 1, 
          //   src: 'https://ik.imagekit.io/iwlmr9llj/98a00570-3aca-467d-be4f-298eb40ca6b1_LWMNKHbwe', 
          //   desc: 'Delicious biryani from a nearby partner — try the signature spice mix!', 
          //   storeId: 'store1',
          //   likes: 124,
          //   comments: 23,
          //   saved: 56,
          //   user: 'Biryani Hub'
          // },
          // { 
          //   id: 2, 
          //   src: 'https://ik.imagekit.io/iwlmr9llj/98a00570-3aca-467d-be4f-298eb40ca6b1_LWMNKHbwe', 
          //   desc: 'Fresh smoothies made to order, seasonal fruits and zero sugar options.', 
          //   storeId: 'store2',
          //   likes: 89,
          //   comments: 12,
          //   saved: 34,
          //   user: 'Smoothie Palace'
          // },
          // { 
          //   id: 3, 
          //   src: 'https://ik.imagekit.io/iwlmr9llj/98a00570-3aca-467d-be4f-298eb40ca6b1_LWMNKHbwe', 
          //   desc: 'Late night tacos — crispy shells, juicy fillings, and amazing salsa.', 
          //   storeId: 'store3',
          //   likes: 215,
          //   comments: 45,
          //   saved: 78,
          //   user: 'Taco Nights'
          // },
          // { 
          //   id: 4, 
          //   src: 'https://ik.imagekit.io/iwlmr9llj/98a00570-3aca-467d-be4f-298eb40ca6b1_LWMNKHbwe', 
          //   desc: 'Wood-fired pizzas with fresh ingredients and homemade dough.', 
          //   storeId: 'store4',
          //   likes: 312,
          //   comments: 67,
          //   saved: 102,
          //   user: 'Pizza Heaven'
          // },
          // { 
          //   id: 5, 
          //   src:'https://ik.imagekit.io/iwlmr9llj/98a00570-3aca-467d-be4f-298eb40ca6b1_LWMNKHbwe', 
          //   desc: 'Healthy salads with organic vegetables and premium dressings.', 
          //   storeId: 'store5',
          //   likes: 178,
          //   comments: 34,
          //   saved: 89,
          //   user: 'Green Garden'
          // },
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
      const videos = await axios.get("http://localhost:3000/api/food/", {
        withCredentials: true
      })
      setTimeout(() => {
        setVideos(videos.data.foodItems);
        console.log(videos.data.foodItems);
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
    navigate(`/store/:${storeId}`)
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
            src={v.video} 
            playsInline 
            muted 
            loop 
            preload="auto"
          />
          {console.log(v.video)}
          {/* Video overlay with user info and description */}
          <div className="reel-overlay">
            <div className="user-info">
              <div className="user-avatar">🍔</div>
              <div className="user-name">{v.name}</div>
            </div>
            <div className="reel-desc">{v.description}</div>
            <button 
              className="visit-store-btn" 
              onClick={(e) => handleVisitStore(v._id, e)}
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