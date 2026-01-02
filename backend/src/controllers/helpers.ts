import { ZodError } from "zod"

import { HttpResponse, HttpStatusCode } from "./protocols"

export const ok = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
})

export const registered = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.REGISTERED,
  body,
})

export const logged = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
})

export const badRequest = (message: string): HttpResponse<string> => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: message,
})

export const serverError = (): HttpResponse<string> => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  body: "Something went wrong",
})

export const notFound = (): HttpResponse<string> => ({
  statusCode: HttpStatusCode.NOT_FOUND,
  body: "User does not exist",
})

export const Conflict = (): HttpResponse<string> => ({
  statusCode: HttpStatusCode.CONFLICT,
  body: "User already exists with this email",
})

export type ValidationIssue = {
  path: string
  message: string
}

export type ValidationErrorBody = {
  message: string
  issues: ValidationIssue[]
}

export const validationError = (
  error: ZodError,
  message = "Invalid data",
): HttpResponse<ValidationErrorBody> => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: {
    message,
    issues: error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    })),
  },
})
