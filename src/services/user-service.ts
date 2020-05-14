import {  UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import { ResourceNotFoundError } from '../errors/errors';

export class UserService {
    constructor (private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    /**
     * Gets all users in the system
     * Admin role required (NIY) Not implemented yet
     */
    async getAllUsers(): Promise<User[]> {
        try {
            let users = await this.userRepo.getAll();

            if (users.length === 0) {
                throw new ResourceNotFoundError();
            }

            return users.map(this.removePassword);
        } catch (e) {
            throw e;
        }
    }

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        delete user.password;
        return user;   
    }
}