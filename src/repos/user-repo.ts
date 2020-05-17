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
     * Creates a new user in the system with info provided.
     * @param newUser {User} the new user that will be added to the database
     */
    async save(newUser: User): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let roleId = (await client.query('select user_id from user_roles where name = $1', [newUser.role])).rows[0].id;

            let sql = `
                insert into users (username, password, first_name, last_name, email, user_role_id)
                values ($1, $2, $3, $4, $5) returning user_id
            `;

            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId])
            newUser.id = rs.rows[0].id;

            return newUser;
        } catch (e) {
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
    }

};