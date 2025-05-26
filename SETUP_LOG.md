# Email Auth 프로젝트 설정 로그

> React + TypeScript + Webpack 프로젝트에 ESLint, Prettier, Husky, shadcn/ui 설정

## 📋 오늘 작업한 내용 요약

### 1. 개발 도구 설치 및 설정

#### ESLint, Prettier, Husky, lint-staged 패키지 설치

```bash
# ESLint 관련
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y

# Prettier 관련
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Husky와 lint-staged
npm install --save-dev husky lint-staged
```

#### shadcn/ui 관련 패키지 설치

```bash
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react @radix-ui/react-slot
```

### 2. 설정 파일 생성

#### `eslint.config.js` (ESLint v9 설정)

```javascript
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...prettierConfig.rules,
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

#### `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false
}
```

#### `.prettierignore`

```
node_modules
build
dist
.next
coverage
*.min.js
package-lock.json
```

#### `components.json` (shadcn/ui 설정)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "./app/components",
    "utils": "./app/lib/utils"
  }
}
```

#### `.lintstagedrc.json`

```json
{
  "app/**/*.{ts,tsx}": ["npx eslint --fix --no-error-on-unmatched-pattern", "npx prettier --write"],
  "app/**/*.{json,css}": ["npx prettier --write"]
}
```

### 3. package.json 스크립트 추가

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack --mode production",
    "lint": "eslint app --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint app --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"app/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"app/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "prepare": "husky"
  }
}
```

### 4. Husky 설정

#### Husky 초기화

```bash
npx husky init
echo 'npx lint-staged' > .husky/pre-commit
```

### 5. TypeScript 설정 수정

#### `tsconfig.json` 업데이트

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "app/*": ["./app/*"]
    }
  },
  "include": ["app"]
}
```

### 6. Webpack 설정 수정

#### `webpack.config.js` resolve alias 추가

```javascript
resolve: {
  extensions: ['.ts', '.tsx', '.js'],
  alias: {
    app: path.resolve('app'),
  },
},
```

### 7. 해결한 주요 문제들

#### 🐛 문제 1: shadcn/ui 프레임워크 감지 실패

**원인:** 커스텀 Webpack 설정으로 인한 자동 감지 실패
**해결:** `components.json` 수동 생성 및 설정

#### 🐛 문제 2: lint-staged가 node_modules까지 처리

**원인:** 광범위한 파일 패턴 설정
**해결:** `app/**/*` 패턴으로 범위 제한

#### 🐛 문제 3: ESLint에서 브라우저 전역 객체 인식 불가

**원인:** ESLint v9에서 globals 설정 누락
**해결:** `languageOptions.globals`에 `document`, `window` 등 추가

#### 🐛 문제 4: React import 에러

**원인:** TypeScript의 synthetic default import 설정 문제
**해결:** React 17+에서는 JSX용 React import 불필요하므로 제거

#### 🐛 문제 5: TypeScript 모듈 해석 문제

**원인:** `moduleResolution: "bundler"`와 React 19 호환성 문제
**해결:** `moduleResolution: "node"`로 변경

#### 🐛 문제 6: package-lock.json conflict

**원인:** 브랜치 간 의존성 버전 차이
**해결:** `node_modules`와 `package-lock.json` 삭제 후 재설치

### 8. shadcn/ui 컴포넌트 설치

#### 설치된 컴포넌트들

- Button: `app/components/ui/button.tsx`
- Input: `app/components/ui/input.tsx`

#### utils 함수 생성

```typescript
// app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 9. 추천 프로젝트 구조

#### Feature-based 구조 (모범 사례)

```
app/
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Header, Footer)
│   └── features/        # 기능별 컴포넌트
│       ├── auth/
│       └── email/
├── pages/               # 페이지 컴포넌트
├── lib/                 # 유틸리티
└── types/               # 타입 정의
```

## ✅ 최종 결과

- ✅ ESLint, Prettier, Husky, lint-staged 완전 설정
- ✅ shadcn/ui 컴포넌트 시스템 구축
- ✅ 타입 안정성 확보
- ✅ 자동 코드 포맷팅 및 린팅
- ✅ Git pre-commit hook으로 코드 품질 보장
- ✅ 모듈 경로 문제 해결
- ✅ React 19 호환성 확보

## 🚀 다음 단계

1. 페이지 컴포넌트 개발
2. 이메일 인증 기능 구현
3. 추가 shadcn/ui 컴포넌트 설치
4. 상태 관리 도구 도입 (필요시)
5. API 통신 레이어 구축

---

**참고:** 이 설정은 React 19 + TypeScript + Webpack 환경에서 테스트되었으며, 모든 린팅 도구와 포맷팅 도구가 정상 작동합니다.
