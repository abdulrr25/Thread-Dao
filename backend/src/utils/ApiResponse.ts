export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };

  constructor(
    success: boolean,
    message: string,
    data?: T,
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    }
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(
    message: string,
    data?: T,
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    }
  ): ApiResponse<T> {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message);
  }
} 