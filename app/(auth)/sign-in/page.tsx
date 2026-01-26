import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

export default function SignInPage() {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
          Skin Analyzer
          <span className="h-1 w-1 rounded-full bg-primary" />
          Secure access
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back.
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Review your latest skin scans, track progress, and plan your next
            care routine with confidence.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-xs">
            <p className="text-sm font-medium text-foreground">
              Daily insights
            </p>
            <p className="text-muted-foreground text-xs">
              Visualize hydration, texture, and tone changes in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-xs">
            <p className="text-sm font-medium text-foreground">Care plans</p>
            <p className="text-muted-foreground text-xs">
              Stay aligned with personalized routines and reminders.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Trusted by clinics and independent specialists.
        </div>
      </section>

      <Card className="border-border bg-card/90 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue with your preferred provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SocialAuthButtons />
        </CardContent>
      </Card>
    </div>
  );
}
