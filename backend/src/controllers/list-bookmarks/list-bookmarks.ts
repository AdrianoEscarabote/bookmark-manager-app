import { badRequest, ok, serverError } from "../helpers"
import { HttpRequest, HttpResponse, IBookmarkRepository, IController } from "../protocols"

import { ListBookmarksParams, ListBookmarksReturnTypes } from "./protocols"

export class ListBookmarksController implements IController {
  constructor(private readonly listBookmarksRepository: IBookmarkRepository) {}

  async handle(
    HttpRequest: HttpRequest<ListBookmarksParams>,
  ): Promise<HttpResponse<ListBookmarksReturnTypes | string>> {
    try {
      const userId = HttpRequest.body?.userId

      if (!userId) {
        return badRequest("userId is required")
      }

      const bookmarks = await this.listBookmarksRepository.list({ userId })

      return ok(bookmarks)
    } catch {
      return serverError()
    }
  }
}
