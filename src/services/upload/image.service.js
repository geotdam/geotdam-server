import imageRepository from '../../repositories/upload/image.repository.js';

export const uploadImageToGCS = async (file) => {
  if (!file) throw new Error('No file provided');
  return await imageRepository.uploadToBucket(file);
};
