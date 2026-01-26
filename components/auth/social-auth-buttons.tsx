"use client";

import type { SVGProps } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.03 1.53 7.42 2.8l5.4-5.4C33.54 3.77 29.1 2 24 2 14.9 2 7.2 7.2 3.56 14.8l6.73 5.22C12.07 13.05 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.6c-.54 2.9-2.15 5.36-4.59 7.02l7.07 5.5C43.11 37.37 46.5 31.53 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.29 28.02A14.5 14.5 0 019.5 24c0-1.39.24-2.74.68-4.02l-6.73-5.22A22 22 0 002 24c0 3.54.85 6.9 2.35 9.88l5.94-5.86z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.1 0 9.4-1.68 12.53-4.59l-7.07-5.5c-1.96 1.31-4.48 2.08-5.46 2.08-6.4 0-11.92-3.55-13.88-8.52l-5.94 5.86C7.2 40.8 14.9 46 24 46z"
      />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 512" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M279.14 288l14.22-92.66h-88.91V127.41c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.2V288z"
      />
    </svg>
  );
}

export function SocialAuthButtons() {
  const handleGoogleSignIn = () => {
    signIn("google", {
      redirect: true,
      redirectTo: "/",
    })
  }
  const handleFacebookSignIn = () => {
    signIn("facebook")
  }
  return (
    <div className="grid gap-3">
      <Button
        className="w-full gap-2 cursor-pointer"
        autoFocus
        type="button"
        size="lg"
        onClick={handleGoogleSignIn}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-background shadow-xs">
          <GoogleIcon className="size-4" />
        </span>
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full gap-2 cursor-pointer"
        type="button"
        size="lg"
        onClick={handleFacebookSignIn}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
          <FacebookIcon className="size-4" />
        </span>
        Continue with Facebook
      </Button>
    </div>
  );
}
