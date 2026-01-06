import z from "zod"

import { BookmarksRepository } from "@/repositories/bookmarks"

import { ok, serverError, validationError, ValidationErrorBody } from "../helpers"
import { HttpRequest, HttpResponse, IController } from "../protocols"

import { DeleteBookmarkParams, DeleteBookmarkReturnTypes } from "./protocols"

const deleteParamsSchema = z
  .object({
    userId: z.string().trim().min(1, { message: "userId is required" }),
    bookmarkId: z.string().trim().min(1, { message: "bookmarkId is required" }),
  })
  .strict()

export class DeleteBookmarkController implements IController {
  constructor(private readonly bookmarksRepository: BookmarksRepository) {}

  async handle(
    HttpRequest: HttpRequest<DeleteBookmarkParams>,
  ): Promise<HttpResponse<DeleteBookmarkReturnTypes | ValidationErrorBody | string>> {
    try {
      const parsed = deleteParamsSchema.safeParse(HttpRequest.body ?? {})

      if (!parsed.success) {
        return validationError(parsed.error)
      }

      const bookmark = await this.bookmarksRepository.delete({
        bookmarkId: parsed.data.bookmarkId,
        userId: parsed.data.userId,
      })

      return ok(bookmark)
    } catch {
      return serverError()
    }
  }
}
