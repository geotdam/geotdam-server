// src/config/tmap.config.js
import dotenv from 'dotenv';
dotenv.config();

export const TMAP_API_KEY = process.env.TMAP_API_KEY;
export const TMAP_TRANSIT_KEY=process.env.TMAP_TRANSIT_KEY;