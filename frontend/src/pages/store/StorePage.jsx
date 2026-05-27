import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import './StorePage.css';

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFoodPartner = true; // TODO: wire real auth/role
  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/food-partner/${storeId}`);
      const { foodPartner, reels, foodItems } = response.data || {};
      setStoreData({
        ...foodPartner,
        reels: reels || [],
        foodItems: foodItems || [],
      });
    } catch (error) {
      console.error('Error fetching store data:', error);
      // Fallback demo data
      setStoreData({
        _id: storeId,
        businessName: "Spice Junction",
        address: "123 Food Street, Mumbai",
        totalMeals: 43,
        customersServed: "15K",
        rating: 4.7,
        category: "Indian Cuisine",
        reels: [
          { id: 1, thumbnail: "https://via.placeholder.com/150x200?text=Video+1", views: "1.2K", likes: 245 },
          { id: 2, thumbnail: "https://via.placeholder.com/150x200?text=Video+2", views: "2.4K", likes: 512 },
          { id: 3, thumbnail: "https://via.placeholder.com/150x200?text=Video+3", views: "3.1K", likes: 789 },

        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    navigate('/partner/upload');
  };

  if (loading) {
    return (
      <div className="store-page">
        <div className="loading-spinner">Loading store...</div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="store-page">
        <div className="error-message">Store not found</div>
      </div>
    );
  }

  return (
    <div className="store-page">
      {/* Header Section */}
      <div className="store-header">
        <div className="store-profile">
          <div className="store-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">{storeData.businessName.charAt(0)}</span>
            </div>
          </div>
          <div className="store-info">
            <div className="business-name">{storeData.businessName}</div>
            <div className="store-address">{storeData.address}</div>
            <div className="store-category">{storeData.category || "Food Partner"}</div>
            <div className="store-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-value">{storeData.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="store-stats">
          <div className="stat-item">
            <div className="stat-value">{storeData.totalMeals}</div>
            <div className="stat-label">Total Meals</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{storeData.customersServed}</div>
            <div className="stat-label">Customers Served</div>
          </div>
        </div>
      </div>

      {/* Upload Button for Food Partners */}
      {isFoodPartner && (
        <div className="upload-section">
          <button className="upload-button" onClick={handleUploadClick}>
            <span className="upload-icon">+</span>
            Upload New Food Video
          </button>
        </div>
      )}

      {/* Videos Grid Section */}
      <div className="videos-section">
        <h2 className="section-title">Food Videos</h2>
        <div className="videos-grid">
          {(storeData.reels || storeData.videos || []).map((reel) => (
            <div key={reel._id || reel.id} className="video-card">
              <div className="video-thumbnail">
                {reel.videoUrl ? (
                  <video
                    className="video-media"
                    src={reel.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    onClick={(e) =>
                      e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()
                    }
                  />
                ) : (
                  <img className="video-media" src={reel.thumbnail} alt={`Video ${reel.id}`} />
                )}
                <div className="play-overlay">
                  <div className="play-icon">▶</div>
                </div>
                <div className="video-stats">
                  {reel.title ? (
                    <span className="stat">{reel.title}</span>
                  ) : (
                    <>
                      <span className="stat">👁️ {reel.views}</span>
                      <span className="stat">❤️ {reel.likes}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
