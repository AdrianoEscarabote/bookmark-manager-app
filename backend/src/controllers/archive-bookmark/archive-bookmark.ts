import z from "zod"

import { ok, serverError, validationError, ValidationErrorBody } from "../helpers"
import { HttpRequest, HttpResponse, IBookmarkRepository, IController } from "../protocols"

import { ArchiveBookmarkParams, ArchiveBookmarkReturnTypes } from "./protocols"

const archiveParamsSchema = z
  .object({
    userId: z.string().trim().min(1, { message: "userId is required" }),
    bookmarkId: z.string().trim().min(1, { message: "bookmarkId is required" }),
  })
  .strict()

export class ArchiveBookmarkController implements IController {
  constructor(private readonly archiveBookmarkRepository: IBookmarkRepository) {}

  async handle(
    HttpRequest: HttpRequest<ArchiveBookmarkParams>,
  ): Promise<HttpResponse<ArchiveBookmarkReturnTypes | ValidationErrorBody | string>> {
    try {
      const parsed = archiveParamsSchema.safeParse(HttpRequest.body ?? {})

      if (!parsed.success) {
        return validationError(parsed.error)
      }

      const bookmark = await this.archiveBookmarkRepository.archive({
        bookmarkId: parsed.data.bookmarkId,
        userId: parsed.data.userId,
      })

      return ok(bookmark)
    } catch {
      return serverError()
    }
  }
}
