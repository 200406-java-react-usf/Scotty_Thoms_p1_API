import express from 'express';
import AppConfig from '../config/app';

export const ReimbursementRouter = express.Router();

const reimbursementService = AppConfig.reimbursementService;

/**
 * Used to get all reimbursements 
 */
ReimbursementRouter.get('', async (req, resp) => {
    try {
        let payload = await reimbursementService.getAllReimb();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(400).json(e);
    }
});

ReimbursementRouter.post('', async (req, resp) => {
    try {
        let newReimb = await reimbursementService.addNewReimb(req.body);
        return resp.status(201).json(newReimb);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
})