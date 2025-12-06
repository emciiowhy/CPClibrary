import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

const bookStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'book-covers',
    public_id: () => `book-${Date.now()}`,
  },
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profiles',
    public_id: (req, file) => `profile-${Date.now()}`,
  },
});


const uploadBook = multer({
  storage: bookStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

export { cloudinary, uploadBook, uploadProfile };