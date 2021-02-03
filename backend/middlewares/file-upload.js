const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const MIME_TYPE_MAP = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif"
}

const fileUpload = multer({
  limit: 5000000, //bytes
  storage: multer.diskStorage({
    destination: (req, file, callback) => { //tell the callback where the file stored
      callback(null, 'uploads/images');
    },
    filename: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, `${uuidv4()}.${ext}`)
    }
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype] //true or false
    let error = isValid ? null : new Error('Invalid mime type');
    callback(error, isValid);
  }
});

module.exports = fileUpload;