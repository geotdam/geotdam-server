import express from 'express';
import multer from 'multer';
import { uploadImage } from '../../controllers/upload/image.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload/image', upload.single('image'), uploadImage);

export default router;
