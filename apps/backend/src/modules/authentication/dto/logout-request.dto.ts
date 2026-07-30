export class LogoutRequestDto {
  sessionId!: string;
}

export class LogoutResponseDto {
  success!: boolean;
  message!: string;
}
