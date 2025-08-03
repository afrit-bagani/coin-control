type successResponseType<T = any> = {
  success: true;
  message: string;
  data?: T;
};
type ErrorResponseType<T = any> = {
  success: false;
  message: string;
  error?: T;
};

/**
 * Shortcut for a success response. By default success = true
 * @param message  human‑readable message
 * @param data     optional payload
 */
export const successResponse = <T = any>(
  message: string,
  data?: T
): successResponseType => {
  return { success: true, message, data };
};

/**
 * Shortcut for an error response. By default success = false,
 * @param message  human‑readable message
 * @param error     optional error payload
 */
export const errorResponse = <T = any>(
  message: string,
  error?: T
): ErrorResponseType => {
  return { success: false, message, error };
};
