import express, { response } from 'express';
import AppConfig from '../config/app';
import { Principal } from '../dtos/principal';

export const AuthRouter = express.Router();

const userService = AppConfig.userService;

/**
 * Used to "logout"
 */

 AuthRouter.get('', async (req,resp) => {
     delete req.session.principal;
     resp.status(204).send();
 });

/**
 * Used to login user given correct username and password
 */

AuthRouter.post('', async (req,resp) => {
    try {
        const { username, password } = req.body;
        let authUser = await userService.authenticateUser(username, password);
        let payload = new Principal(authUser.id, authUser.username, authUser.role);
        req.session.principal = payload;
        let loggedInUser = await userService.getUserById(authUser.id);
        resp.status(200).json(loggedInUser);
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }
});