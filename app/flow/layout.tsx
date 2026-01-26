"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FlowProgress } from "@/components/ui/flow-progress";

const steps = [
  {
    title: "Capture image",
    href: "/flow/capture",
  },
  {
    title: "Register / login",
    href: "/flow/auth",
  },
  {
    title: "Payment",
    href: "/flow/payment",
  },
  {
    title: "Results",
    href: "/flow/results",
  },
];

function getActiveStep(pathname: string | null) {
  if (!pathname) return 1;
  const idx = steps.findIndex((step) => pathname.startsWith(step.href));
  return idx === -1 ? 1 : idx + 1;
}

export default function FlowLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeStep = getActiveStep(pathname);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(900px_circle_at_8%_10%,rgba(14,165,233,0.16),transparent_60%),radial-gradient(700px_circle_at_92%_8%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))] text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-80 -translate-x-1/2 rounded-full bg-linear-to-r from-sky-200/60 via-emerald-200/50 to-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-8%] h-72 w-72 rounded-full bg-linear-to-tr from-slate-200/60 via-sky-100/50 to-emerald-100/60 blur-3xl"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Skin Analyzer
          </p>
          <FlowProgress
            steps={steps}
            activeStep={activeStep}
            onStepChange={(step) => {
              const next = steps[step - 1];
              if (next) router.push(next.href);
            }}
            className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur"
          />
        </header>
        <main className="min-w-0 rounded-[28px] border border-border bg-card/60 p-5 shadow-xl sm:rounded-[32px] sm:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
