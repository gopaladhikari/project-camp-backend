// Standard api Error class

export class ApiError extends Error {
  status: number;
  success = false;
  data: unknown;
  error?: unknown;

  constructor(
    status: number,
    message: string,
    error?: unknown,
    stack = "",
  ) {
    super(message);
    this.status = status;
    this.success = false;
    this.data = null;
    this.message = message;
    if (error) this.error = error;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

// Standard api response class

export class ApiResponse {
  status: number;
  message: string;
  data: any;
  success = true;

  constructor(status: number, message: string, data: any) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
