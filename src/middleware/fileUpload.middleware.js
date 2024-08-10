import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the upload directory exists
const uploadDir = path.join('public', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);  
    cb(null, uniqueName);  
  }
  
});

const upload = multer({
  storage: storage,
}).single('resume');  

export default upload;
