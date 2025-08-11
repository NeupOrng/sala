export function badRequest(message: string, data?: any) {
  return createError({ statusCode: 400, statusMessage: message, data });
}

export function unauthorized(message = 'Unauthorized') {
  return createError({ statusCode: 401, statusMessage: message });
}

export function forbidden(message = 'Forbidden') {
  return createError({ statusCode: 403, statusMessage: message });
}

export function notFound(message = 'Not Found') {
  return createError({ statusCode: 404, statusMessage: message });
}

export function methodNotAllowed(message = 'Method Not Allowed') {
  return createError({ statusCode: 405, statusMessage: message });
}

export function notAcceptable(message = 'Not Acceptable') {
  return createError({ statusCode: 406, statusMessage: message });
}

export function proxyAuthenticationRequired(message = 'Proxy Authentication Required') {
  return createError({ statusCode: 407, statusMessage: message });
}

export function requestTimeout(message = 'Request Timeout') {
  return createError({ statusCode: 408, statusMessage: message });
}

export function conflict(message = 'Conflict') {
  return createError({ statusCode: 409, statusMessage: message });
}

export function gone(message = 'Gone') {
  return createError({ statusCode: 410, statusMessage: message });
}

export function lengthRequired(message = 'Length Required') {
  return createError({ statusCode: 411, statusMessage: message });
}

export function preconditionFailed(message = 'Precondition Failed') {
  return createError({ statusCode: 412, statusMessage: message });
}

export function payloadTooLarge(message = 'Payload Too Large') {
  return createError({ statusCode: 413, statusMessage: message });
}

export function uriTooLong(message = 'URI Too Long') {
  return createError({ statusCode: 414, statusMessage: message });
}

export function unsupportedMediaType(message = 'Unsupported Media Type') {
  return createError({ statusCode: 415, statusMessage: message });
}

export function rangeNotSatisfiable(message = 'Range Not Satisfiable') {
  return createError({ statusCode: 416, statusMessage: message });
}

export function expectationFailed(message = 'Expectation Failed') {
  return createError({ statusCode: 417, statusMessage: message });
}

export function imATeapot(message = 'I\'m a teapot') {
  return createError({ statusCode: 418, statusMessage: message });
}

export function misdirectedRequest(message = 'Misdirected Request') {
  return createError({ statusCode: 421, statusMessage: message });
}

export function unprocessableEntity(message = 'Unprocessable Entity') {
  return createError({ statusCode: 422, statusMessage: message });
}

export function locked(message = 'Locked') {
  return createError({ statusCode: 423, statusMessage: message });
}

export function failedDependency(message = 'Failed Dependency') {
  return createError({ statusCode: 424, statusMessage: message });
}

export function upgradeRequired(message = 'Upgrade Required') {
  return createError({ statusCode: 426, statusMessage: message });
}

export function preconditionRequired(message = 'Precondition Required') {
  return createError({ statusCode: 428, statusMessage: message });
}

export function tooManyRequests(message = 'Too Many Requests') {
  return createError({ statusCode: 429, statusMessage: message });
}

export function requestHeaderFieldsTooLarge(message = 'Request Header Fields Too Large') {
  return createError({ statusCode: 431, statusMessage: message });
}

export function unavailableForLegalReasons(message = 'Unavailable For Legal Reasons') {
  return createError({ statusCode: 451, statusMessage: message });
}
export function internalServerError(message = 'Internal Server Error') {
  return createError({ statusCode: 500, statusMessage: message });
}