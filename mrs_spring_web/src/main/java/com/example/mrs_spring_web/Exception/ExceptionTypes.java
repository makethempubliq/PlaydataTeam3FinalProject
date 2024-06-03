package com.example.mrs_spring_web.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionTypes {
    BadCredentialsException(401, "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해 주세요."),
    UsernameNotFoundException(402, "계정이 존재하지 않습니다. 회원가입 진행 후 로그인 해주세요."),
    AccountExpiredException(403, "계정만료"),
    CredentialsExpiredException(404, "비밀번호만료"),
    DisabledException(405, "계정비활성화"),
    LockedException(406, "계정잠김"),
    NoneException(407, "알 수 없는 에러 입니다.");
    private int code;
    private String msg;
}
