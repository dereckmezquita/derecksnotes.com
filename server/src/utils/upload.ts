import multer from 'multer';
import path from 'path';

// way to save directly; we're not using this since doing all manipulation in memory
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    // storage: storage,
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // limit to 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('profileImage');  // `profileImage` is the field name for our file input

// Check File Type
function checkFileType(file: any, cb: any) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

export default upload;
