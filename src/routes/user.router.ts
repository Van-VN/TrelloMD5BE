import UserController from '../controllers/user.controller';
import { Router } from 'express';
import { auth } from '../middleware/auth';
const userRoute = Router();
import multer from 'multer';
const upload = multer();

userRoute.post('/user/create', upload.none(), UserController.createUser);
userRoute.post('/user/login', upload.none(), UserController.userLogin);
userRoute.get('/user/info/:userId', UserController.getUserInfo);
userRoute.put(
  '/user/update/:userId',
  upload.none(),
  auth,
  UserController.updateUser
);
userRoute.put('/user/password/:userId', auth, UserController.resetPassword);
userRoute.get('/user/confirmEmail/:token', UserController.authEmail);
userRoute.post('/user/sentNewPassword', UserController.sentNewPassword);
userRoute.get('/user/search', upload.none(), auth, UserController.searchUsers);
userRoute.get(
  '/user/notifications/:id',
  upload.none(),
  auth,
  UserController.getAllNotification
);

export default userRoute;
