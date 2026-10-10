import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "登入" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-sm space-y-6 pt-6">
      <div className="text-center">
        <h1 className="text-2xl font-black">登入 / 註冊</h1>
        <p className="mt-1 text-sm text-slate-500">輸入 Email，我們會寄送一次性登入連結。</p>
      </div>
      <Suspense fallback={null}>
        <LoginFormWithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : "/account"} />;
}
