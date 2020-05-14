import { User } from '../models/user';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError } from '../errors/errors';

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
};