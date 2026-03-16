import { MatyanErrorType } from './engine/types';
/**
 * @class MatyanError representing a Matyan error object.
 *
 * Usage:
 *  <pre>
 *    new MatyanError()
 *    new MatyanError(message)
 *    new MatyanError(message, detail)
 *  </pre>
 *
 * @param {string} message - error message
 * @param {Record<string, any>} detail - error details
 * @return {MatyanError} - Matyan error object
 */

class MatyanError extends Error {
  detail: Record<string, any>;
  constructor(message?: string, detail: Record<string, any> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.detail = detail;
  }

  getError(): MatyanErrorType {
    return {
      name: this.name,
      message: this.message,
      detail: this.detail,
    };
  }
}

export default MatyanError;
