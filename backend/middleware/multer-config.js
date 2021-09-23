// import
const multer = require('multer')

// settings for files received

// list of types of files accepted
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

// Create a configuration object to get the images on the local disk storage
const storage = multer.diskStorage({
    // Show destination where to put the file
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Get the name of the sent file
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
})


// export
module.exports = multer({storage : storage}).single('file');