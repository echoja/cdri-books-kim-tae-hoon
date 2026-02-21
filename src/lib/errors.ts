type AppErrorCode =
  | "API_KEY_MISSING"
  | "UNAUTHORIZED"
  | "RATE_LIMIT"
  | "SERVER"
  | "NETWORK"
  | "UNKNOWN";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;

  constructor(code: AppErrorCode, message: string, status?: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case "API_KEY_MISSING":
        return "API 키가 설정되지 않았습니다. .env 파일의 VITE_KAKAO_REST_API_KEY를 확인해 주세요.";
      case "UNAUTHORIZED":
        return "API 인증에 실패했습니다. API 키 권한과 값을 확인해 주세요.";
      case "RATE_LIMIT":
        return "요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해 주세요.";
      case "SERVER":
        return "서버 응답이 일시적으로 불안정합니다. 다시 시도해 주세요.";
      case "NETWORK":
        return "네트워크 연결이 불안정합니다. 연결 상태를 확인해 주세요.";
      default:
        return error.message;
    }
  }

  return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}
