import path from 'path'
import express from 'express'
import multer from 'multer'
import AWS from 'aws-sdk'
import Jimp from 'jimp'
const router = express.Router()


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// definition place where image are stored and with what name
//const storage = multer.diskStorage({
//  destination(req, file, cb) {
//    cb(null, 'uploads/')
//  },
//  filename(req, file, cb) {
 //   cb(
 //     null,
//      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//    )
 // },
//})

// function checking file extenstion with regex expression
//function checkFileType(file, cb) {
//  const filetypes = /jpg|jpeg|png/
 // const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
 // const mimetype = filetypes.test(file.mimetype)

 // if (extname && mimetype) {
 //   return cb(null, true)
 // } else {
 //   cb('seuls les fichiers jpg, jpeg et png sont authorisés')
 // }
//}

// verifivation of file type 
//const upload = multer({
 // storage,
 // fileFilter: function (req, file, cb) {
 //   checkFileType(file, cb)
 // },
//})

// route definition with path to file in response object
router.post('/', upload.single('file'), async (req, res) => {
  let info = req.body;

  try {
    const image = req.file;

    const file = await Jimp.read(Buffer.from(image.buffer, 'base64'))
      .then(async image => {
        const background = await Jimp.read('https://url/background.png');
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        image.resize(Jimp.AUTO, 900);
        image.composite(background, 1000, 700);
        image.print(font, 1000, 700, 'Logo');
        return image.getBufferAsync(Jimp.AUTO);
      })
      .catch(err => {
        res.status(500).json({ msg: 'Server Error', error: err });
      });


    const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    //Where you want to store your file

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: image.originalname,
      Body: file,
      ContentType: image.mimetype,
      ACL: 'public-read'
    };

    s3bucket.upload(params, async (err, data) => {
      try {
        if (err) {
          res.status(500).json({ error: true, Message: err });
        } else {
          const newFileUploaded = {
            description: req.body.description,
            fileLink: s3FileURL + image.originalname,
            s3_key: params.Key
          };
          info = { ...info, photo: newFileUploaded.fileLink };
          // Add all info to database after store picture to S3
          const photos = await database.addPhoto(db, info);
          res.send(photos);
        }
      } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err });
  }
});

export default router
