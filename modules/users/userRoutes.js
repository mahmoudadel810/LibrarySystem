import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { myMulter, validation_object } from "../../services/local_multer.js";
import { loginValidator, signUpValidator, verifyReset, updatePassword } from "./user.validation.js";
const router = Router();
import * as userController from './userController.js';
//-----------------------------------------------------------------------------------------------------------

router.post('/signUp', validation(signUpValidator), userController.signUp);
router.get('/confirmEmail/:token', userController.confirmEmail);
router.post('/signIn', validation(loginValidator), userController.signIn);
router.put('/updatePassword', auth(), validation(updatePassword), userController.updatePassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/verifyReset', validation(verifyReset), userController.verifyReset);
router.put('/updateProfile', auth(), userController.updateProfile);
router.put('/softDelete/:userId', auth(), userController.softDelete);
router.delete('/deleteProfile', auth(), userController.deleteProfile);

router.patch('/profilePicture', auth(), myMulter({
    customValidation: validation_object.image,
    customPath: 'user/profile'
}).single('profile'), userController.profilePicture);

router.patch('/cloudProfile', auth(), myMulter({
    customValidation: validation_object.image

}).single('image'), userController.cloudProfile);

export default router;