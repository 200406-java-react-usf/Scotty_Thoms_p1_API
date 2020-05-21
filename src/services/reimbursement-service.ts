import { ReimbursementRepository } from "../repos/reimbursement-repo";
import { Reimbursement } from "../models/reimbursement";
import { ResourceNotFoundError, BadRequestError } from "../errors/errors";
import { isValidObject, isValidId, isEmptyObject } from "../util/validator";

export class ReimbursementService {
    constructor (private reimbRepo: ReimbursementRepository) {
        this.reimbRepo = reimbRepo;
    }

    /**
     * Gets all reimbursements in the system
     */
    async getAllReimb(): Promise<Reimbursement[]> {
        try {
            let reimbs = await this.reimbRepo.getAll();

            if (reimbs.length === 0) {
                throw new ResourceNotFoundError();
            }

            return reimbs;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Reimbursement to be added (will always start with pending state)
     * @param newReimb {Reimbursement}
     */
    async addNewReimb(newReimb: Reimbursement): Promise<Reimbursement> {

        if (!isValidObject(newReimb)) {
            throw new BadRequestError('One or more fields are missing');
        }

        const persistedReimb = await this.reimbRepo.save(newReimb);

        return persistedReimb;
    }

    /**
     * Will either approve or deny a pending reimbursement
     * @param newReimb {Reimbursement}
     */
    async updateReimb(newReimb: Reimbursement): Promise<boolean> {
        if (!isValidObject(newReimb) || !isValidId(newReimb.reimb_id)) {
            throw new BadRequestError();
        }

        // if (!this.getReimbById(newReimb.reimb_id)) throw new BadRequestError('Bad ID');
        
        // if(newReimb.resolver_id) 
        await this.reimbRepo.resolve(newReimb);
        // else await this.reimbRepo.update(newReimb);

        
        return true;


        
    }

    /**
     * Will search to see if a reimbursement with reimb_id (id) exists
     * @param id {number} id of reimbursement
     */
    async getReimbById(id: number): Promise<Reimbursement> {
        try {
            let reimb = await this.reimbRepo.getById(id);
            console.log(reimb);

            if (isEmptyObject(reimb)) {
                throw new ResourceNotFoundError('No reimb found with that ID');
            }

            return reimb;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Returns all the reimbursements that one user has
     * @param username {string} username for user to retrieve all specific reimbursements to them
     */
    async getReimbursementByUsername(username: string) {
        const reimbs = await this.reimbRepo.getReimbursementByUsername(username);
        return reimbs;
    }
}