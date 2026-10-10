import type { Metadata } from "next";
import { isMlbCbaSettled } from "@/lib/env";
import { TripForm } from "./trip-form";

export const metadata: Metadata = {
  title: "美國觀賽旅遊",
  description: "NBA、NFL、MLB 美國觀賽行程設計與中文導覽，由合作之合法旅行社承辦。",
};

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">美國觀賽旅遊</h1>
        <p className="mt-2 text-sm text-slate-600">
          告訴我們想看哪個聯盟、什麼時候出發，我們會比對賽程、設計行程，並轉介給合作的合法旅行社報價。
        </p>
      </div>

      <ul className="space-y-1 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        <li>・票務、交通、球場周邊與中文導覽一次規劃</li>
        <li>・所有行程附延賽／取消條款</li>
        <li>・團費由合法旅行社收取並開立代收轉付收據，本站不直接收取團費</li>
      </ul>

      {!isMlbCbaSettled() && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-bold">⚠️ 2027 MLB 行程：勞資風險</p>
          <p className="mt-1">
            MLB 勞資協議於 2026/12/1 到期，聯盟預期封館，2027 球季開打時間未定。2027 年的 MLB 行程在協議落定前
            <strong>只開放候補登記</strong>，不預售。
          </p>
        </div>
      )}

      <TripForm />
    </div>
  );
}
