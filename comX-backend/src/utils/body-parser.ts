import { responseCodes } from "./response-codes";
import { Request, Response } from "express";
import {ZodType} from "zod";

export const bodyParser = (schema: ZodType, req: Request, res: Response) => {
    const parseResult = schema.safeParse(req.body);
    if(!parseResult.success){
        responseCodes.clientError.badRequest(res, parseResult.error.errors, "message");
        return false;
    }
    return true;
}