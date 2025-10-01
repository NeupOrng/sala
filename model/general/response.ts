export type ResponseDto<T = unknown> = {
  statusCode: number;
  statusMessage: string;
  data?: T;
};