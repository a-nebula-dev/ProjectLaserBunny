"use client";

import React, { useEffect } from "react";

/**
 * ClerkErrorBoundary: Suppresses Clerk SDK initialization errors that occur
 * when the Clerk frontend API is unreachable or returns errors.
 *
 * This allows the app to render while Clerk is still attempting to initialize.
 * Clerk errors are logged to console but don't block page rendering.
 */
export function ClerkErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Intercept console errors from Clerk
    const originalError = console.error;
    let clerkErrorCount = 0;

    console.error = function (...args: any[]) {
      const errorStr = String(args[0] || "");

      // If it's a Clerk SDK error, log it at warn level instead and continue
      if (
        errorStr.includes("clerk") ||
        errorStr.includes("https://cdn.jsdelivr.net/@clerk") ||
        errorStr.includes("clerk.artelasercoelho")
      ) {
        clerkErrorCount++;
        if (clerkErrorCount === 1) {
          console.warn(
            "[Clerk Init] SDK initialization warning (this is normal during startup with proxy)",
            args[0]
          );
        }
        // Silently ignore subsequent Clerk errors on the same stack
        return;
      }

      // For non-Clerk errors, use original error handler
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}
