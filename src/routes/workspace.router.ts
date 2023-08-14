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

workSpaceRoute.delete(
  '/workspace/delete/:id',
  upload.none(),
  auth,
  WorkSpaceController.deleteWorkSpace
);

workSpaceRoute.delete(
  '/workspace/rmuser',
  upload.none(),
  auth,
  WorkSpaceController.removeUserFromWorkspace
);
workSpaceRoute.put(
  '/workspace/updateUser',
  auth, 
  WorkSpaceController.updateUserPermission
);
workSpaceRoute.post(
  '/workspace/:id',
  upload.none(),
  // auth,
  WorkSpaceController.updateWorkSpace
);

export default workSpaceRoute;
