import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { ROUTES } from "@/constant/route";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-6 py-8">
        <div className="text-center">
          <Link href={ROUTES.HOME} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            LP Record
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            회원가입
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            LP Record 서비스에 가입하여 다양한 기능을 이용해보세요.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-md rounded-lg">
          <SignupForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              이미 계정이 있으신가요?{" "}
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                로그인
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-xs text-yellow-800">
            <strong>참고:</strong> 회원가입 후 관리자 권한이 필요한 경우, 데이터베이스에서 수동으로 role을 'admin'으로 변경해야 합니다.
          </p>
        </div>
      </div>
    </main>
  );
}