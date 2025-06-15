import { 
  CLOUDINARY_UPLOAD_PRESET, 
  CLOUDINARY_UPLOAD_URL, 
  CLOUDINARY_API_KEY 
} from '@/config/cloudinary';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  // Add other fields you might need from Cloudinary
  width?: number;
  height?: number;
  format?: string;
  created_at?: string;
  bytes?: number;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);
  
  try {
    console.log('Uploading file to Cloudinary:', file.name, 'size:', file.size);
    
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Cloudinary upload error:', error);
      throw new Error(error.message || `Failed to upload image to Cloudinary: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Cloudinary upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};
