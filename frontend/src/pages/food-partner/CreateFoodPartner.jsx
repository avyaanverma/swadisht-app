import React, { useState } from 'react';
import axios from 'axios';
import './CreateFoodPartner.css';

export default function CreateFoodPartner() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        handleVideoSelect(file);
      }
    }
  };

  const handleVideoSelect = (file) => {
    setVideoFile(file);
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelect(e.target.files[0]);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !title.trim() || !description.trim()) {
      alert('Please fill all fields and select a video');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      
      // Replace with your actual backend endpoint
      const response = await axios.post('http://localhost:3000/api/food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials:true
      });
      
      console.log('Upload successful:', response.data);
      
      // Reset form
      setVideoFile(null);
      setVideoPreview(null);
      setTitle('');
      setDescription('');
      
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <div className="header-section">
          <h1 className="main-title">Create Food</h1>
          <p className="subtitle">Upload a photo, video, your experiences and add a description</p>
          <div className="file-info">
            <span className="file-count">0/20 FILES</span>
          </div>
        </div>

        <div className="upload-section">
          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${videoPreview ? 'has-video' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!videoPreview ? (
              <div className="upload-content">
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 20H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="upload-title">Tap to upload or drag and drop</h3>
                <p className="upload-subtitle">Only Videos. MOV, mp4 are allowed</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="file-input"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="upload-button">
                  Choose File
                </label>
              </div>
            ) : (
              <div className="video-preview-container">
                <video
                  src={videoPreview}
                  className="video-preview"
                  controls
                  muted
                />
                <div className="video-actions">
                  <span className="video-name">{videoFile.name}</span>
                  <div className="action-buttons">
                    <button className="action-btn change-btn">Change</button>
                    <button className="action-btn remove-btn" onClick={handleRemoveVideo}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-section">
          <div className="input-group">
            <label htmlFor="title" className="input-label">TITLE</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spicy Chicken Wings"
              className="text-input"
              maxLength={100}
            />
          </div>

          <div className="input-group">
            <label htmlFor="description" className="input-label">DESCRIPTION</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description about your food, ingredients, taste and why people should try it..."
              className="textarea-input"
              rows={4}
              maxLength={500}
            />
            <div className="char-count">{description.length}/500</div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${uploading ? 'uploading' : ''}`}
            disabled={uploading || !videoFile || !title.trim() || !description.trim()}
          >
            {uploading ? 'Uploading...' : 'Save Food'}
          </button>
        </form>
      </div>
    </div>
  );
}