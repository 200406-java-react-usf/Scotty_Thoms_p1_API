import { Request, Response } from "express";


export function corsFilter(req: Request, resp: Response, next) {

    resp.header('Access-Control-Allow-Origin', 'http://scotty-thoms-p1.s3-website.us-east-2.amazonaws.com'); 
    // resp.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    // resp.header('Access-Control-Allow-Origin', req.headers.origin); 
    resp.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    resp.header('Access-Control-Allow-Credentials', 'true');
    resp.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // If this request is an OPTION request (aka "pre-flight request") send it back with a status of 200
    if (req.method === 'OPTIONS') {
        resp.sendStatus(200);
    } else {
        next(); // passes the req and resp objects to the next piece of middleware (or router).
    }

}