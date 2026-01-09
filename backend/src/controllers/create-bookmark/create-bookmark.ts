import { z } from "zod"

import { ok, serverError, validationError, ValidationErrorBody } from "../helpers"
import { HttpRequest, HttpResponse, IBookmarkRepository, IController } from "../protocols"

import { CreateBookmarkParams, CreateBookmarkReturnTypes } from "./protocols"

const createBookmarkSchema = z
  .object({
    userId: z.string().trim().min(1, { message: "userId is required" }),
    title: z.string().trim().min(1, { message: "title is required" }),
    url: z.string().trim().url({ message: "invalid url" }),
    description: z.string().trim().optional().default(""),
    favicon: z.string().trim().optional().default(""),
    tags: z
      .array(z.string().trim().min(1, { message: "invalid tag" }))
      .optional()
      .default([]),
    pinned: z.boolean().optional().default(false),
    isArchived: z.boolean().optional().default(false),
    visitCount: z
      .number()
      .int({ message: "visitCount must be an integer" })
      .min(0, { message: "visitCount must be >= 0" })
      .optional()
      .default(0),
    createdAt: z.preprocess(
      (v) => v ?? new Date().toISOString(),
      z.string().datetime({ message: "invalid createdAt" }),
    ),
    lastVisited: z
      .string()
      .datetime({ message: "invalid lastVisited" })
      .nullable()
      .optional()
      .default(null),
  })
  .strict()

export class CreateBookmarkController implements IController {
  constructor(private readonly createBookmarkRepository: IBookmarkRepository) {}

  async handle(
    HttpRequest: HttpRequest<CreateBookmarkParams>,
  ): Promise<HttpResponse<CreateBookmarkReturnTypes | ValidationErrorBody | string>> {
    try {
      const parsed = createBookmarkSchema.safeParse(HttpRequest.body ?? {})

      if (!parsed.success) {
        return validationError(parsed.error)
      }

      const bookmark = await this.createBookmarkRepository.create(parsed.data)

      return ok(bookmark)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
