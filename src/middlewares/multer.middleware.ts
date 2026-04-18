import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/images");
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
});
