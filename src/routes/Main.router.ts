
import { Router } from 'express';
import UserRoutes from './User.route';

const MainRouter = Router();

MainRouter.use( UserRoutes );

export default MainRouter;