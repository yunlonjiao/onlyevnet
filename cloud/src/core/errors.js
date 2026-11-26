export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message || '请求失败');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function errorPayload(error) {
  if (error instanceof ApiError) {
    const payload = { ok: false, code: error.code, message: error.message, error: error.message };
    if (error.details !== undefined) payload.details = error.details;
    return { status: error.status, payload };
  }
  return { status: 500, payload: { ok: false, code: 'INTERNAL_ERROR', message: '服务器暂时不可用，请稍后再试', error: '服务器暂时不可用，请稍后再试' } };
}

export function codeForStatus(status){
  return ({400:'VALIDATION_ERROR',401:'AUTH_REQUIRED',403:'FORBIDDEN',404:'NOT_FOUND',409:'CONFLICT',413:'PAYLOAD_TOO_LARGE',429:'RATE_LIMITED',500:'INTERNAL_ERROR'})[status]||'REQUEST_FAILED';
}
