import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { trim } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const errorStatus = getErrorStatus(error);
  let message: object;

  if (error instanceof ZodError) {
    message = error.errors.map((issue: any) => ({
      error: trim(`${issue.path.join('.')} is ${issue.message}`),
    }));
  } else {
    message = { error: error.message ?? 'Internal Server Error.' };
  }

  res.status(errorStatus).json({status: errorStatus, message});
};

export const tryCatch =
  (controller: Function, statusCode = StatusCodes.OK) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller(req, res);
      res.status(statusCode).send(result);
    } catch (error) {
      next(error);
    }
  };

export function validateBody(schema: ZodObject<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

function getErrorStatus(error: Error) {
  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if (error instanceof ZodError) return StatusCodes.BAD_REQUEST;

  return StatusCodes.INTERNAL_SERVER_ERROR;
}
