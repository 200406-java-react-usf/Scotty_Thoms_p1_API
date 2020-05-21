import { User } from '../models/user';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError } from '../errors/errors';
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository {
    baseQuery = `
    select
        u.user_id,
        u.username,
        u.password,
        u.first_name,
        u.last_name,
        u.email,
        ur.role_name as user_role_id
    from users u
    join user_roles ur
    on u.user_role_id = ur.role_id
    `;

    /**
     * Gets all users from database
     * Needs admin access (not implemented yet)
     */
    async getAll(): Promise<User[]> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by u.user_id`;
            let rs = await client.query(sql);
            return rs.rows;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Gets a single User with id you send as param if it exists
     * @param id {nubmer} user id
     */
    async getById(id: number): Promise<User> {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.user_id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    /**
     * Creates a new user in the system with info provided.
     * @param newUser {User} the new user that will be added to the database
     */
    async save(newUser: User): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let roleId = (await client.query('select role_id from user_roles where role_name = $1', [newUser.role])).rows[0].role_id;
            let sql = `
                insert into users (username, password, first_name, last_name, email, user_role_id)
                values ($1, $2, $3, $4, $5, $6) returning user_id
            `;


            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId])
            newUser.id = rs.rows[0].id;

            return newUser;
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Updates a user that you send in as param
     * Can only update username, password, first name, and last name (for now)
     * @param updatedUser {User} user you want updated
     */
    async update(updatedUser: User): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    update users
                    set
                        username = $2,
                        password = $3,
                        first_name = $4,
                        last_name = $5,
                        email = $6
                    where user_id = $1
                `;
                await client.query(sql, [updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email]);
                
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

     /**
     * Checks to see if the username exists in the database. 
     * @param username {string} username of user
     */
    async checkUsername(username: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `select * from users where username = $1`;
            let rs = await client.query(sql, [username]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Will check to see if the email is already in the database (another user has this email)
     * @param email {string} email provided
     */
    async checkEmail(email: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `select * from users where email = $1`;
            let rs = await client.query(sql, [email]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Used to login user. Will return User if username and password exist and are correct
     * @param un {string} username of user
     * @param pw {string} password of user
     */
    async getbyCredentials(un: string, pw: string) {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.username = $1 and u.password = $2`
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
    

};