import { Router } from "express";
import VideoController from "../controller/VideoController";

const videosRouter =  Router();

videosRouter.post('/videos',VideoController.create)
videosRouter.get('/videos',VideoController.findAllByUser);

export default videosRouter;