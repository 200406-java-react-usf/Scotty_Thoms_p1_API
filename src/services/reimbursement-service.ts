import { ReimbursementRepository } from "../repos/reimbursement-repo";
import { Reimbursement } from "../models/reimbursement";
import { ResourceNotFoundError } from "../errors/errors";

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

    async addNewReimb(newReimb: Reimbursement): Promise<Reimbursement> {
        const persistedReimb = await this.reimbRepo.save(newReimb);

        return persistedReimb;
    }
}