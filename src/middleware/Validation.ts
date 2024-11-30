import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";

export function ValidateSchema(schema: ObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export const Schemas = {
  user: {
    create: Joi.object<IUser>({
      type: Joi.string().valid("ADMIN", "EMPLOYEE", "PATRON").required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    login: Joi.object<{ email: string; password: string }>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};
