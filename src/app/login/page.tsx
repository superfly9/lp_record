import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/constant/route";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-6 py-8">
        <div className="text-center">
          <Link href={ROUTES.HOME} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            LP Record
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            관리자 로그인
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            관리자 계정으로 로그인하여 LP 관리 기능을 사용하세요.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-md rounded-lg">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              계정이 없으신가요?{" "}
              <Link 
                href="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href={ROUTES.HOME}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}