import { uploadImageToGCS } from '../../services/upload/image.service.js';

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const url = await uploadImageToGCS(file);
    res.status(200).json({ url });
  } catch (err) {
    console.error('[ImageController] Upload error:', err);
    res.status(500).json({ message: 'Image upload failed' });
  }
};
