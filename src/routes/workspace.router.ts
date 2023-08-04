import { Router } from 'express';
import { auth } from '../middleware/auth';
import WorkSpaceController from '../controllers/workSpace.controller';
const workSpaceRoute = Router();

workSpaceRoute.post('/workspaces', auth, WorkSpaceController.createWorkspace);

export default workSpaceRoute;
