import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "./StorePage.css";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:3000";

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu"); // menu | videos
  const [addingId, setAddingId] = useState(null);

  const isFoodPartner =
    session?.authenticated && session.role === "foodPartner" && session.user?.id === storeId;

  const isUser = session?.authenticated && session.role === "user";

  useEffect(() => {
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
        console.error("Error fetching store data:", error);
        setStoreData({
          _id: storeId,
          businessName: "Spice Junction",
          address: "123 Food Street, Mumbai",
          rating: 4.7,
          category: "Indian Cuisine",
          totalMeals: 43,
          customersServed: "15K",
          foodItems: [
            { id: 1, name: "Chicken Biryani", description: "Aromatic basmati rice with tender chicken.", price: 249 },
            { id: 2, name: "Paneer Tikka", description: "Smoky grilled paneer with spices.", price: 199 },
            { id: 3, name: "Masala Dosa", description: "Crispy dosa with potato masala.", price: 149 },
          ],
          reels: [
            { id: 1, thumbnail: "https://via.placeholder.com/150x200?text=Video+1", views: "1.2K", likes: 245 },
            { id: 2, thumbnail: "https://via.placeholder.com/150x200?text=Video+2", views: "2.4K", likes: 512 },
            { id: 3, thumbnail: "https://via.placeholder.com/150x200?text=Video+3", views: "3.1K", likes: 789 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleUploadClick = () => {
    navigate("/partner/upload");
  };

  const addToCart = async (foodItemId) => {
    if (!isUser) {
      navigate("/user/login");
      return;
    }
    setAddingId(foodItemId);
    try {
      await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        { foodItemId, quantity: 1 },
        { withCredentials: true }
      );
      alert("Added to cart.");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
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
      <div className="store-header">
        <div className="store-profile">
          <div className="store-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">{String(storeData.businessName || "S").slice(0, 1)}</span>
            </div>
          </div>
          <div className="store-info">
            <div className="business-name">{storeData.businessName}</div>
            <div className="store-address">{storeData.address}</div>
            <div className="store-category">{storeData.category || "Food Partner"}</div>
            <div className="store-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-value">{storeData.rating || "—"}</span>
            </div>
          </div>
        </div>

        <div className="store-stats">
          <div className="stat-item">
            <div className="stat-value">{storeData.totalMeals || "—"}</div>
            <div className="stat-label">Total Meals</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{storeData.customersServed || "—"}</div>
            <div className="stat-label">Customers Served</div>
          </div>
        </div>
      </div>

      {isFoodPartner && (
        <div className="upload-section">
          <button className="upload-button" onClick={() => navigate("/p/reels/new")}>
            Upload Video
          </button>
          <button
            className="upload-button"
            onClick={() => navigate("/p/foods/new")}
            style={{ marginLeft: 10, background: "#111" }}
          >
            Add Food
          </button>
        </div>
      )}

      <div className="store-tabs">
        <button
          type="button"
          className={`store-tab ${activeTab === "menu" ? "is-active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
        <button
          type="button"
          className={`store-tab ${activeTab === "videos" ? "is-active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
      </div>

      {activeTab === "menu" ? (
        <div className="content-section">
          <div className="section-head">
            <h2 className="section-title">Menu</h2>
          </div>
          <div className="menu-grid">
            {(storeData.foodItems || []).map((item) => (
              <div key={item._id || item.id} className="menu-card">
                <div className="menu-thumb">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="menu-thumb__placeholder">{String(item.name || "F").slice(0, 1)}</div>
                  )}
                </div>
                <div className="menu-body">
                  <div className="menu-top">
                    <div className="menu-name">{item.name}</div>
                    <div className="menu-price">₹{item.price}</div>
                  </div>
                  <div className="menu-desc">{item.description}</div>
                  <button
                    type="button"
                    className="menu-add"
                    onClick={() => addToCart(item._id || item.id)}
                    disabled={addingId === (item._id || item.id)}
                    style={{
                      cursor: "pointer",
                      background: "linear-gradient(135deg,#ff6b6b,#ff9e6b)",
                      color: "#fff",
                    }}
                  >
                    {addingId === (item._id || item.id) ? "Adding..." : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="content-section">
          <h2 className="section-title">Food Videos</h2>
          <div className="videos-grid">
            {(storeData.reels || []).map((reel) => (
              <div key={reel._id || reel.id} className="video-card">
                <div className="video-thumbnail">
                  {reel.videoUrl ? (
                    <video className="video-media" src={reel.videoUrl} controls playsInline preload="metadata" />
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
      )}
    </div>
  );
}
