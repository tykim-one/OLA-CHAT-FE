# 인증 시스템 Quick Reference

> OLA Suite 로그인/회원가입 빠른 참조 가이드

## 🚀 빠른 시작

### 로그인
```
URL: /login
```

### 회원가입
```
URL: /signup
```

## 📁 파일 위치

```
src/
├── contexts/
│   └── SignupFlowContext.tsx
├── components/auth/
│   ├── AuthCard.tsx
│   ├── VerificationCodeInput.tsx
│   ├── SignupEmailStep.tsx
│   ├── SignupVerifyStep.tsx
│   └── SignupInfoStep.tsx
└── app/(auth)/
    ├── layout.tsx
    ├── login/page.tsx
    └── signup/page.tsx
```

## 🎯 회원가입 플로우

```
이메일 입력 → 인증코드 검증 → 추가 정보 입력 → 완료
```

## 🔑 API 연동 포인트

### 1. 인증코드 발송
```typescript
// src/components/auth/SignupEmailStep.tsx (Line ~50)
// TODO: await sendVerificationCode(localEmail)
```

### 2. 코드 검증
```typescript
// src/components/auth/SignupVerifyStep.tsx (Line ~55)
// TODO: await verifyCode(email, verificationCode)
```

### 3. 회원가입 완료
```typescript
// src/components/auth/SignupInfoStep.tsx (Line ~95)
// TODO: await signup(signupData)
```

## 🎨 디자인 참조

- [Figma: 회원가입 플로우](https://www.figma.com/design/NQ8NSfwkFxiqhor5w8LjIx/OneLineAI-B2B?node-id=4840-67472)
- 배경: 검정 (`bg-black`)
- 카드: 반투명 흰색 (`bg-white/90`)
- 버튼 (활성): 검정 (`bg-gray-900`)
- 버튼 (비활성): 회색 (`bg-gray-400`)

## 📖 상세 문서

전체 문서는 [SIGNUP_FLOW.md](./SIGNUP_FLOW.md)를 참조하세요.

---

© 2025 OneLineAI

