
import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
const router = Router();
import * as bookController from './bookController.js';
import { validation } from "../../middlewares/validation.js";
import { addBook } from "./book.validation.js";
import { myMulter, validation_object } from "../../services/local_multer.js";




router.post('/addBook', auth(), validation(addBook), bookController.addBook);;
router.put('/issueaBook/:bookId', auth(), bookController.issueaBook);
router.get('/allissued', auth(), bookController.allissued);
router.get('/search', auth(), bookController.search);
router.get('/notReturned', auth(), bookController.notReturned);
router.get('/notreturnedSearch', auth(), bookController.notreturnedSearch);
router.get('/getAllBook', bookController.getAllBook);

router.patch('/coverPicture', auth(), myMulter({
    customValidation: validation_object.image,
    customPath: 'books/mainCover'
}).single('cover'), bookController.coverPicture); 


router.patch('/bookPictures', auth(), myMulter({
    customValidation: validation_object.image,
    customPath: 'books/BookPictures'
}).array('pictures', 5), bookController.bookPictures);




export default router;