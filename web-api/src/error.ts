import { NextFunction, Request, Response } from "express";

type errorData = {
  [key: string]: any;
};

export class HttpException extends Error {
  statusCode?: number;
  message: string;
  data: errorData;
  code?: string;
  constructor(
    statusCode: number,
    message: string,
    code?: string,
    data?: errorData
  ) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message;
    this.code = code;
    this.data = data ? { ...data } : {};
  }
}

export const badRequestException = (
  message = "400 Bad Request",
  code?: string,
  data?: errorData
): HttpException => {
  return new HttpException(400, message, code, data);
};

export const notFoundException = (
  message = "404 Not Found",
  code?: string,
  data?: errorData
): HttpException => {
  return new HttpException(404, message, code, data);
};

export const forbiddenException = (
  message = "403 Forbidden",
  code?: string,
  data?: errorData
): HttpException => {
  return new HttpException(403, message, code, data);
};

export const internalServerErrorException = (
  message = "500 InternalServerError",
): HttpException => {
  return new HttpException(500, message, "InternalServerError");
};

export const unauthorizedException = (
  message = "403 Unauthorized",
  code?: string,
  data?: errorData
): HttpException => {
  return new HttpException(403, message, code, data);
};


export default function errorHandler(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errorObject = {
    message: err.message,
    code: err.code || null,
    error: {
      ...err.data,
    },
  };
  console.warn("error", errorObject);
  res.status(err.statusCode || 500).send(errorObject);
}
