// server/utils/httpResponse.ts

export type HttpResponse<T = unknown> = {
  statusCode: number;
  statusMessage: string;
  data?: T;
};

export const createResponse = <T>(
  statusCode: number,
  statusMessage: string,
  data?: T
): HttpResponse<T> => ({
  statusCode,
  statusMessage,
  data,
});

// Specific status code helpers
export const ok = <T>(data: T): HttpResponse<T> => createResponse(200, 'OK', data);
export const created = <T>(data: T): HttpResponse<T> => createResponse(201, 'Created', data);
export const accepted = <T>(data: T): HttpResponse<T> => createResponse(202, 'Accepted', data);
export const noContent = (): HttpResponse => createResponse(204, 'No Content');
export const resetContent = (): HttpResponse => createResponse(205, 'Reset Content');
export const partialContent = <T>(data: T): HttpResponse<T> => createResponse(206, 'Partial Content', data);
