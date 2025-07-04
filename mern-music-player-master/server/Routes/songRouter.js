import express from "express";
import multer from "multer";
import { storage } from "../Cloudinary/index.js";
import {
  addNewSong,
  getAllSongs,
  getSongById,
} from "../controllers/songController.js";

const router = express.Router();
const upload = multer({ storage: storage });

router.post("/", upload.single("audio"), addNewSong);
router.get("/", getAllSongs); // <- was "/songs/all"
router.get("/:songId", getSongById); // <- was "/song/:songId"


export default router;
