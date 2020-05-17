import express from 'express';
import AppConfig from '../config/app';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

/**
 * Used to get all users
 */
UserRouter.get('', async (req, resp) => {
    try {
        let payload = await userService.getAllUsers();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(400).json(e);
    }
});

/**
 * Used to create a new user
 */
UserRouter.post('', async (req, resp) => {

    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
});