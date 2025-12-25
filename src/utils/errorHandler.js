/**
 * Centralized Error Handler Utility
 * Handles API errors, network errors, and provides user-friendly error messages
 */

const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT: "TIMEOUT",
  RAZORPAY_ERROR: "RAZORPAY_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Parse error response and return structured error object
 * @param {Error} error - The error object from axios or native JS
 * @returns {Object} - Structured error object with type, message, statusCode
 */
export const parseError = (error) => {
  let errorType = ERROR_TYPES.UNKNOWN_ERROR;
  let userMessage = "An unexpected error occurred. Please try again later.";
  let statusCode = null;
  let details = null;

  // Handle Axios errors
  if (error.response) {
    statusCode = error.response.status;
    const data = error.response.data;

    // Check for API-provided error message
    const apiMessage =
      data?.message || data?.error || data?.msg || data?.errorMessage;

    switch (statusCode) {
      case 400:
        errorType = ERROR_TYPES.VALIDATION_ERROR;
        userMessage =
          apiMessage || "Invalid request. Please check your input and try again.";
        details = data?.errors || data?.details;
        break;

      case 401:
        errorType = ERROR_TYPES.UNAUTHORIZED;
        userMessage =
          apiMessage || "Your session has expired. Please log in again.";
        break;

      case 403:
        errorType = ERROR_TYPES.FORBIDDEN;
        userMessage =
          apiMessage ||
          "You don't have permission to access this resource.";
        break;

      case 404:
        errorType = ERROR_TYPES.NOT_FOUND;
        userMessage = apiMessage || "The requested resource was not found.";
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorType = ERROR_TYPES.SERVER_ERROR;
        userMessage =
          apiMessage ||
          "Server error occurred. Our team has been notified. Please try again later.";
        break;

      default:
        errorType = ERROR_TYPES.SERVER_ERROR;
        userMessage =
          apiMessage ||
          `Request failed with status ${statusCode}. Please try again.`;
    }
  } else if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    errorType = ERROR_TYPES.NETWORK_ERROR;
    userMessage =
      "Network error: Unable to connect to the server. Please check your internet connection.";
  } else if (error.code === "ENOTFOUND" || error.message === "Network Error") {
    errorType = ERROR_TYPES.NETWORK_ERROR;
    userMessage =
      "Connection failed: Unable to reach the server. Please check your internet connection and try again.";
  } else if (error.message && error.message.includes("timeout")) {
    errorType = ERROR_TYPES.TIMEOUT;
    userMessage =
      "Request timeout: The server took too long to respond. Please try again.";
  } else if (error.message) {
    userMessage = error.message;
  }

  return {
    type: errorType,
    message: userMessage,
    statusCode,
    details,
    originalError: error,
  };
};

/**
 * Summary of error for logging/debugging purposes
 * @param {Object} parsedError - The parsed error object
 * @returns {string} - Summary string for console logging
 */
export const getErrorSummary = (parsedError) => {
  const { type, statusCode, message } = parsedError;
  return `[${type}] ${statusCode ? `Status ${statusCode}: ` : ""}${message}`;
};

/**
 * Check if error is authentication related
 * @param {Object} parsedError - The parsed error object
 * @returns {boolean}
 */
export const isAuthError = (parsedError) => {
  return parsedError.type === ERROR_TYPES.UNAUTHORIZED;
};

/**
 * Check if error is network related
 * @param {Object} parsedError - The parsed error object
 * @returns {boolean}
 */
export const isNetworkError = (parsedError) => {
  return (
    parsedError.type === ERROR_TYPES.NETWORK_ERROR ||
    parsedError.type === ERROR_TYPES.TIMEOUT
  );
};

/**
 * Check if error is server related
 * @param {Object} parsedError - The parsed error object
 * @returns {boolean}
 */
export const isServerError = (parsedError) => {
  return parsedError.type === ERROR_TYPES.SERVER_ERROR;
};

/**
 * Validate Razorpay response
 * @param {Object} response - Razorpay payment response
 * @returns {Object} - Validation result with success flag and message
 */
export const validateRazorpayResponse = (response) => {
  if (!response) {
    return {
      success: false,
      message: "Payment response is empty.",
      type: ERROR_TYPES.RAZORPAY_ERROR,
    };
  }

  const requiredFields = ["razorpay_payment_id", "razorpay_order_id", "razorpay_signature"];
  const missingFields = requiredFields.filter((field) => !response[field]);

  if (missingFields.length > 0) {
    return {
      success: false,
      message: `Missing required payment fields: ${missingFields.join(", ")}`,
      type: ERROR_TYPES.RAZORPAY_ERROR,
    };
  }

  return {
    success: true,
    message: "Payment response is valid.",
  };
};

export default {
  parseError,
  getErrorSummary,
  isAuthError,
  isNetworkError,
  isServerError,
  validateRazorpayResponse,
  ERROR_TYPES,
};
