import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_AVATAR } from '../../constants/images';

const ProfilePictureUpload = ({ currentAvatar, onAvatarChange, size = 'large' }) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: { width: '60px', height: '60px' },
    medium: { width: '80px', height: '80px' },
    large: { width: '120px', height: '120px' }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        
        // In a real app, you would upload to a server here
        // For demo purposes, we'll just store in localStorage
        if (onAvatarChange) {
          onAvatarChange(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    if (onAvatarChange) {
      onAvatarChange(null);
    }
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getAvatarDisplay = () => {
    if (preview) {
      return (
        <img
          src={preview}
          alt="Profile"
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      );
    } else {
      return (
        <img
          src={DEFAULT_AVATAR}
          alt="Default Profile"
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            // If default avatar fails, show icon
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
  };

  return (
    <div className="profile-picture-upload text-center">
      <div className="position-relative d-inline-block">
        <div
          className="rounded-circle overflow-hidden border border-3 border-light shadow-sm position-relative"
          style={{ width: sizeClasses[size].width, height: sizeClasses[size].height }}
        >
          {getAvatarDisplay()}
          
          {/* Fallback for broken images */}
          <div
            className="w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted position-absolute top-0 start-0"
            style={{ display: 'none' }}
          >
            <FontAwesomeIcon icon={faUser} size="2x" />
          </div>
        </div>
        
        {/* Upload button overlay */}
        <button
          type="button"
          className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}
          onClick={handleUploadClick}
          disabled={isUploading}
          title="Change profile picture"
        >
          <FontAwesomeIcon icon={faCamera} size="sm" />
        </button>
      </div>
      
      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Action buttons */}
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm me-2"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <FontAwesomeIcon icon={faCamera} className="me-1" />
          {preview ? 'Change Photo' : 'Upload Photo'}
        </button>
        
        {preview && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
          >
            <FontAwesomeIcon icon={faTrash} className="me-1" />
            Remove
          </button>
        )}
      </div>
      
      <div className="mt-2">
        <small className="text-muted">
          Recommended: Square image, at least 200x200px<br />
          Max file size: 5MB
        </small>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
