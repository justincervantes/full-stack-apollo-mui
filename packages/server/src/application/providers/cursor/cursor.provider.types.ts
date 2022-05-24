export interface GetCursorResultInput {
  cursor?: string | null;
  limit?: number | null;
}

export interface GetCursorIndexInput {
  cursor?: string | null;
}

export interface GetCursorIndexResponse {
  cursorIndex: number;
  totalDataLength: number;
}
