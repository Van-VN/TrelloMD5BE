import { Router } from 'express';
import { auth } from '../middleware/auth';
import WorkSpaceController from '../controllers/workSpace.controller';
const workSpaceRoute = Router();
import multer from 'multer';
const upload = multer();

workSpaceRoute.post(
  '/workspaces',
  upload.none(),
  auth,
  WorkSpaceController.createWorkspace
);
workSpaceRoute.get(
  '/workspaces/:userId',
  upload.none(),
  WorkSpaceController.listWorkspaces
);

workSpaceRoute.get(
  '/workspace/:id',
  upload.none(),
  WorkSpaceController.getWorkspace
);

workSpaceRoute.post(
  '/workspace/adduser',
  upload.none(),
  auth,
  WorkSpaceController.addUserToWorkspace
);

export default workSpaceRoute;
