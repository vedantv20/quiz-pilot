import axios from './axios';

// Upload question image
export const uploadQuestionImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post('/upload/question-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete question image
export const deleteQuestionImage = async (filename) => {
  const response = await axios.delete(`/upload/question-image/${filename}`);
  return response.data;
};