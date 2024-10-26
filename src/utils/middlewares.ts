import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { responseError } from './wrapper';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next(); 
  } catch (error) {
    if (error instanceof ZodError) {
      return responseError(res, 400, error.errors.map(e => e.path + " " + e.message));
    }
    next(error);
  }
};
  
export const validateParams = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.params);
    next(); 
  } catch (error) {
    if (error instanceof ZodError) {
      return responseError(res, 400, error.errors.map(e => e.path + " " + e.message));
    }
    next(error);
  }
};
  
export const validateQueries = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.query);
    next(); 
  } catch (error) {
    if (error instanceof ZodError) {
      return responseError(res, 400, error.errors.map(e => e.path + " " + e.message));
    }
    next(error);
  }
};
  