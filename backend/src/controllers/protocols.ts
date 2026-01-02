import { Response } from "express"

import { ArchiveBookmarkParams, ArchiveBookmarkReturnTypes } from "./archive-bookmark/protocols"
import { CreateBookmarkParams, CreateBookmarkReturnTypes } from "./create-bookmark/protocols"
import { DeleteBookmarkParams, DeleteBookmarkReturnTypes } from "./delete-bookmark/protocols"
import { ListBookmarksParams, ListBookmarksReturnTypes } from "./list-bookmarks/protocols"
import { UpdateBookmarkParams, UpdateBookmarkReturnTypes } from "./update-bookmark/protocols"

export interface HttpResponse<T> {
  statusCode: number
  body: T
}

export interface HttpRequest<B> {
  params?: any
  headers?: any
  body?: B
}

export enum HttpStatusCode {
  OK = 200,
  REGISTERED = 201,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export interface IController {
  handle(HttpRequest: HttpRequest<unknown>, res: Response<unknown>): Promise<HttpResponse<unknown>>
}

export interface IBookmarkRepository {
  create: (data: CreateBookmarkParams) => Promise<CreateBookmarkReturnTypes>
  list: (data: ListBookmarksParams) => Promise<ListBookmarksReturnTypes>
  update: (data: UpdateBookmarkParams) => Promise<UpdateBookmarkReturnTypes>
  archive: (data: ArchiveBookmarkParams) => Promise<ArchiveBookmarkReturnTypes>
  delete: (data: DeleteBookmarkParams) => Promise<DeleteBookmarkReturnTypes>
}
