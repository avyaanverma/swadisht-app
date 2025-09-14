import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StorePage.css';

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFoodPartner, setIsFoodPartner] = useState(true); // Assume user is food partner for UI demo

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      // Replace with your actual backend endpoint
      const response = await axios.get(`http://localhost:3000/api/store/${storeId}`);
      setStoreData(response.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
      // Fallback demo data
      setStoreData({
        id: storeId,
        businessName: "Spice Junction",
        address: "123 Food Street, Mumbai",
        totalMeals: 43,
        customersServed: "15K",
        rating: 4.7,
        category: "Indian Cuisine",
        videos: [
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
    navigate('/create-food');
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
            <div className="store-category">{storeData.category}</div>
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
          {storeData.videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={`Video ${video.id}`} />
                <div className="play-overlay">
                  <div className="play-icon">▶</div>
                </div>
                <div className="video-stats">
                  <span className="stat">👁️ {video.views}</span>
                  <span className="stat">❤️ {video.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}