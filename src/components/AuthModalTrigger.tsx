"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AuthModalTrigger() {
  const { openSignIn, openSignUp } = useClerk();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);

  const serializedSearch = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(serializedSearch);
    const action = params.get("auth");

    if (!action) {
      hasTriggered.current = false;
      return;
    }

    if (action !== "signin" && action !== "signup") {
      return;
    }

    const handler = action === "signup" ? openSignUp : openSignIn;
    if (!handler) {
      return;
    }

    if (hasTriggered.current) {
      return;
    }
    hasTriggered.current = true;

    const rawReturnUrl = params.get("returnUrl") || "/";
    const sanitizedReturnUrl = rawReturnUrl.startsWith("/")
      ? rawReturnUrl
      : `/${rawReturnUrl}`;

    params.delete("auth");
    params.delete("returnUrl");

    const remainingQuery = params.toString();
    const cleanUrl = `${pathname}${remainingQuery ? `?${remainingQuery}` : ""}`;

    try {
      handler({
        redirectUrl: sanitizedReturnUrl,
        afterSignInUrl: sanitizedReturnUrl,
        afterSignUpUrl: sanitizedReturnUrl,
      });
    } finally {
      router.replace(cleanUrl, { scroll: false });
    }
  }, [serializedSearch, openSignIn, openSignUp, pathname, router]);

  return null;
}
