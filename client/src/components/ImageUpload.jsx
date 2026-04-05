import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { uploadAPI } from '../api';
import toast from 'react-hot-toast';

export const ImageUpload = ({ 
  imageUrl, 
  onImageChange, 
  onImageRemove,
  className = "",
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadQuestionImage(file);
      
      if (response.data?.success) {
        const imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '')}${response.data.data.imageUrl}`;
        onImageChange(imageUrl, response.data.data.filename);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = async () => {
    if (onImageRemove) {
      await onImageRemove();
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Question Image (Optional)
      </label>
      
      {imageUrl ? (
        // Image preview with remove option
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Question preview"
            className="w-full max-w-md h-auto rounded-lg border border-border shadow-sm"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Upload area
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF, WEBP up to {maxSize / (1024 * 1024)}MB
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="btn-secondary flex items-center space-x-2"
                    onClick={triggerFileSelect}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {imageUrl && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Image uploaded successfully
          </p>
          <button
            type="button"
            onClick={triggerFileSelect}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            Replace image
          </button>
        </div>
      )}
    </div>
  );
};