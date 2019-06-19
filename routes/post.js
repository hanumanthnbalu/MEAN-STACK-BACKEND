const express = require('express');

const router = express();
const postController = require('../controllers/post');
const multer = require('multer');
const isAuth = require('../middleware/is-auth');

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now()+'.'+ext);
    }
})



router.post('/post',multer({storage: storage}).single("image"), isAuth, postController.createPost);
router.get('/post/:id', postController.getPost);
router.get('', postController.getPosts);
router.put('/post/:id',multer({storage: storage}).single("image"), isAuth, postController.updatePost);
router.delete('/post/:id', isAuth, postController.deletePost);

module.exports = router;
