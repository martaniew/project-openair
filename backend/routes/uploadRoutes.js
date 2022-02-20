import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
const router = express.Router();
// import path from 'path';
import { protect, admin } from "../middleware/authMiddleware.js";
 

 
//multer s3
const s3 = new aws.S3();
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-3'
});
 
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};
 
const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3: s3,
    bucket: `openairimages`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});
 
// see npm multer diskstorage
/* const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      // you dont need the dot
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
}); */
 
//custom cb validation
/* function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
 
  if (extname && mimetype) {
    //null means no error
    //theres no 404 error here
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
} */
 
/* const upload = multer({
  //storage:storage
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}); */
 
/* const returnImageUrl = (req, res) => {
  //removes backslash
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
}; */
 
const returnImageUrl = (req, res) => {
  console.log(res)
  return res.send(`${req.file.location}`);
  
};
 
//test keys
// const getKeys = (req, res) => {
//   res.json({
//     secretAccessKey: process.env.S3_ACCESS_KEY_ID,
//     accessKeyId: process.env.S3_SECRET_ACCESS_KEY
//   });
// };
 
//single file upload
router
  .route('/')
  .post(protect, upload.single('image'), returnImageUrl);
// .get(getKeys);
 
export default router;


