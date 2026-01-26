"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button variant="default" onClick={() => signOut()}>
      Log out
    </Button>
  );
}
