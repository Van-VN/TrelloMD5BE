import UserController from '../controllers/user.controller';
import { Router } from 'express';
import { auth } from '../middleware/auth';
const userRoute = Router();
import multer from 'multer';
const upload = multer();

userRoute.post('/user/create', upload.none(), UserController.createUser);
userRoute.post('/user/login', upload.none(), UserController.userLogin);
userRoute.post('/user/update', upload.none(), UserController.updateUser);
userRoute.get('/user/search', upload.none(), auth, UserController.searchUsers);

export default userRoute;
