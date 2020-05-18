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
}