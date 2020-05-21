import { Reimbursement } from "../models/reimbursement";
import { PoolClient } from "pg";
import { connectionPool } from "..";
import { InternalServerError } from "../errors/errors";

export class ReimbursementRepository {
    baseQuery = `
        select 
            r.reimb_id,
            r.amount,
            r.submitted,
            r.resolved,
            r.description,
            r.receipt,
            u.username as author_id,
            r.resolver_id,
            rs.reimb_status as reimb_status_id,
            rt.reimb_type as reimb_type_id
        from reimbursements r
        join reimbursement_status rs 
        on r.reimb_status_id = rs.reimb_status_id
        join reimbursement_types rt
        on r.reimb_type_id = rt.reimb_type_id 
        join users u
        on r.author_id = u.user_id 
    `

    /**
     * Gets all reimbursements from the database
     */
    async getAll(): Promise<Reimbursement[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by reimb_id`;
            let rs = await client.query(sql);
            return rs.rows;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Gets all reimbursements from specific user
     * @param username {string} username 
     */
    async getReimbursementByUsername(username: string): Promise<Reimbursement[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where username = $1`;
            let rs = await client.query(sql, [username]);
            return rs.rows;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Creates a new reimbursement in the system
     * @param newReimb {Reimbursement} the new reimbursement that will be added to the database
     */
    async save(newReimb: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            // let reimbId = (await client.query(`select reimb_type_id from reimbursement_types where reimb_type = $1`, [newReimb.reimb_type_id])).rows[0].reimb_type_id;
            let sql = `
            insert into reimbursements (amount, submitted, description, author_id, reimb_status_id, reimb_type_id )
            values ($1, CURRENT_TIMESTAMP, $2, $3, 1, $4  ) returning reimb_id
            `;

            let rs = await client.query(sql, [newReimb.amount, newReimb.description, newReimb.author_id, newReimb.reimb_type_id]);
            newReimb.reimb_id = rs.rows[0].reimb_id;

            return newReimb;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async resolve(updatedReimb: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `
                update reimbursements
                set
                    resolved = CURRENT_TIMESTAMP,
                    resolver_id = $2,
                    reimb_status_id = $3
                where reimb_id = $1
            `;
            let rs = await client.query(sql, [updatedReimb.reimb_id, updatedReimb.resolver_id, updatedReimb.reimb_status_id]);
            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<Reimbursement> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.reimb_id = $1`;
            let rs = await client.query(sql, [id]);
            return rs.rows[0];
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

}