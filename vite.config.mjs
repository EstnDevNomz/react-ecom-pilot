import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "development"
      ? ".env.development"
      : ".env.production",
});

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@services": "/src/services",
      "@styles": "/src/styles",
      "@utils": "/src/utils",
      "@constants": "/src/constants",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@assets": "/src/assets",
    },
  },
  server: {
    port: parseInt(process.env.VITE_LOCAL_PORT, 10),
    open: true,
    proxy: {
      "/test": {
        // '/test' 경로 프록시 설정
        target: "https://www.google.com", // 타겟 서버 URL
        secure: false, // HTTPS 사용 시 필요
        changeOrigin: true, // CORS 헤더 변경
        rewrite: (path) => path.replace(/^\/test/, ""), // '/test'를 제거하여 타겟 서버의 루트로 요청
      },
    },
  },
});
