import express from 'express';
import AppConfig from '../config/app';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', async (req, resp) => {
    try {
        let payload = await userService.getAllUsers();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(400).json(e);
    }
});