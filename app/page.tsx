import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_10%,rgba(14,165,233,0.16),transparent_60%),radial-gradient(700px_circle_at_92%_8%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))] text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-80 -translate-x-1/2 rounded-full bg-linear-to-r from-sky-200/60 via-emerald-200/50 to-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-8%] h-72 w-72 rounded-full bg-linear-to-tr from-slate-200/60 via-sky-100/50 to-emerald-100/60 blur-3xl"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-16">
        <div className="flex w-full items-center justify-end pb-8">
          <LogoutButton />
        </div>
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              Skin Analyzer
              <span className="h-1 w-1 rounded-full bg-primary" />
              Authorization
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Authorization flows built with shadcn/ui.
              </h1>
              <p className="text-muted-foreground">
                Jump into the new sign in experience. It is ready to wire to
                your auth provider.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                <Link href="/analyze">Analyze</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                <Link href="/flow">Start flow</Link>
              </Button>
            </div>
          </div>
          <Card className="border-border bg-card/50 text-card-foreground">
            <CardHeader>
              <CardTitle>What is included</CardTitle>
              <CardDescription className="text-muted-foreground">
                Two dedicated pages styled to match the existing design system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-chart-2" />
                  Social sign-in buttons for Google and Facebook.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-chart-3" />
                  Marketing callouts for clarity and trust.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-chart-4" />
                  Responsive layout ready for production wiring.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
