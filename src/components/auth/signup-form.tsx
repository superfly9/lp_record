"use client";
// hook-form 사용으로 추후 바꾸기
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      // 회원가입
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        // 프로필 생성 (기본적으로 user role)
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          display_name: displayName,
          role: "user", // 기본값, 나중에 admin으로 수동 변경 필요
        });

        if (profileError) {
          console.error("프로필 생성 오류:", profileError);
        }

        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 w-full max-w-md text-center">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            회원가입 완료!
          </h3>
          <p className="text-sm text-green-700 mb-4">
            계정이 성공적으로 생성되었습니다.
            <br />
            관리자 권한이 필요한 경우 별도로 설정해주세요.
          </p>
          <Button onClick={() => router.push("/login")} variant="default">
            로그인하러 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1">
          이름
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium mb-1"
        >
          이메일
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium mb-1"
        >
          비밀번호
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder="6자 이상 입력하세요"
          minLength={6}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !email || !password || !displayName}
        className="w-full"
      >
        {isLoading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};
