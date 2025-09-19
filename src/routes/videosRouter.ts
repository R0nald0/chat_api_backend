import { Router } from "express";
import VideoController from "../controller/VideoController";

const videosRouter =  Router();

videosRouter.post('/videos',VideoController.create)
videosRouter.get('/videos/:ownerId',VideoController.findAllByUser);

export default videosRouter;