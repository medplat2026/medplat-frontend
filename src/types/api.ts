export type APIError = {
  message: string;
  statusCode?: number;
  errors?: Record<string, unknown>;
};
