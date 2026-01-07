/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod"

import { BookmarksRepository } from "@/repositories/bookmarks"

import { ok, serverError, validationError, ValidationErrorBody } from "../helpers"
import { HttpRequest, HttpResponse, IController } from "../protocols"

import { UpdateBookmarkParams, UpdateBookmarkReturnTypes } from "./protocols"

const visitSchema = z
  .object({
    bookmarkId: z.string().trim().min(1, { message: "bookmarkId is required" }),
    userId: z.string().trim().min(1, { message: "userId is required" }),
    action: z.literal("visit"),
  })
  .strict()

const patchSchema = z
  .object({
    bookmarkId: z.string().trim().min(1, { message: "bookmarkId is required" }),
    userId: z.string().trim().min(1, { message: "userId is required" }),

    title: z.string().trim().min(1, { message: "title is required" }).optional(),
    url: z.string().trim().url({ message: "url must be a valid URL" }).optional(),
    favicon: z.string().trim().min(1, { message: "favicon must be a valid URL" }).optional(),

    description: z.string().trim().min(0, { message: "description is required" }).optional(),
    tags: z.array(z.string().trim()).optional(),
    pinned: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    visitCount: z.number().int().min(0).optional(),
    lastVisited: z.coerce.date().nullable().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const { userId: _userId, bookmarkId: _bookmarkId, ...patch } = data
    const hasAnyFieldToUpdate = Object.values(patch).some((v) => v !== undefined)

    if (!hasAnyFieldToUpdate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide at least one field to update",
      })
    }
  })

const updateBookmarkBodySchema = z.union([visitSchema, patchSchema])

export class UpdateBookmarkController implements IController {
  constructor(private readonly bookmarksRepository: BookmarksRepository) {}

  async handle(
    HttpRequest: HttpRequest<UpdateBookmarkParams>,
  ): Promise<HttpResponse<UpdateBookmarkReturnTypes | ValidationErrorBody | string>> {
    try {
      const parsedBody = updateBookmarkBodySchema.safeParse(HttpRequest.body ?? {})
      if (!parsedBody.success) return validationError(parsedBody.error, "Invalid body")

      const bookmark = await this.bookmarksRepository.update(parsedBody.data)

      return ok(bookmark)
    } catch {
      return serverError()
    }
  }
}
