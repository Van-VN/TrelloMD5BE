import UserController from '../controllers/user.controller';
import { Router } from 'express';
const userRoute = Router();
import multer from 'multer';
const upload = multer();

userRoute.post('/user/create', upload.none(), UserController.createUser);
userRoute.post('/user/login', upload.none(), UserController.userLogin);

export default userRoute;
