import UserController from '../controllers/user.controller';
import { Router } from 'express';
const userRoute = Router();
import multer from 'multer';
import { auth } from '../middleware/auth';
const upload = multer();

userRoute.post('/user/create', upload.none(), UserController.createUser);
userRoute.post('/user/login', upload.none(), UserController.userLogin);
userRoute.get('/user/info', auth, UserController.getUserInfo);
userRoute.put('/user/update', auth, UserController.updateUser);
userRoute.put('/user/password', auth, UserController.resetPassword);
userRoute.get('/user/confirmEmail/:token', UserController.authEmail);
userRoute.get('/user/sentNewPassword', UserController.sentNewPassword);


export default userRoute;
