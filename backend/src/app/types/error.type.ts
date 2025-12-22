export type ErrorSource = { path: string | number; message: string };
export type ErrorInterface = {
  statusCode: number;
  message: string;
  errorMessages: ErrorSource[];
};
