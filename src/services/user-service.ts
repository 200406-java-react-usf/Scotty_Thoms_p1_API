import {  UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import { ResourceNotFoundError, ResourcePersistenceError } from '../errors/errors';

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

    /**
     * Will add a new user to database
     * @param newUser {User} user to add
     */
    async addNewUser(newUser: User): Promise<User> {

        let isUsernameAvailable = await this.checkUsername(newUser.username);

        if (!isUsernameAvailable) {
            throw new ResourcePersistenceError('This username is already taken.');
        }

        let isEmailAvailable = await this.checkEmail(newUser.email);

        if (!isEmailAvailable) {
            throw new ResourcePersistenceError('This email is already registered with another user. Please provide a different email.');
        }

        newUser.role = 'Employee';
        const persistedUser = await this.userRepo.save(newUser);

        return this.removePassword(persistedUser);
    }

    /**
     * Will check to see if the username already exists in the database
     * @param username {string} username
     */
    async checkUsername(username: string): Promise<boolean> {
        
        let usernameExists = await this.userRepo.checkUsername(username);
        if (this.isEmpty(usernameExists)) {
            console.log(`username ${username} is available.`);
            return true;
        } else {
            console.log(`username ${username} is already taken.`);
            return false;
        }
        
    }
    
    /**
     * Will check to see if the email is already in the database (another user has this email)
     * @param email {string} email provided
     */
    async checkEmail(email: string): Promise<boolean> {

        let emailExists = await this.userRepo.checkEmail(email);
        if (this.isEmpty(emailExists)) {
            console.log(`email ${email} is available.`);
            return true;
        } else {
            console.log(`email ${email} is already registered with another user.`);
            return false;
        }
    }

    private isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }  


    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        delete user.password;
        return user;   
    }
}