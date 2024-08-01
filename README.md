# React Webview Project
## File structrue
public/: 정적 파일을 위한 폴더입니다. index.html은 앱의 진입점이 됩니다.
src/: 소스 코드의 메인 폴더입니다.
    components/: 재사용 가능한 React 컴포넌트들을 저장합니다.
    hooks/: 커스텀 React 훅을 저장합니다.
    pages/: 각 라우트에 해당하는 페이지 컴포넌트를 저장합니다.
    services/: API 호출이나 Sendbird 관련 로직을 관리합니다.
    store/: Zustand나 Jotai를 사용한 상태 관리 로직을 저장합니다.
    styles/: 전역 스타일과 CSS 변수를 관리합니다.
    utils/: 유틸리티 함수와 상수를 저장합니다.
    App.jsx: 앱의 메인 컴포넌트입니다.
    main.jsx: 앱의 진입점입니다.
    tests/: Jest를 사용한 테스트 파일을 저장합니다.
    
설정 파일: ESLint, Prettier, Vite