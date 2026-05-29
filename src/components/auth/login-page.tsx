"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { PasswordField } from "@/components/ui/password-field";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { ROUTES } from "@/constants/routes";
import { clearAuthSession, inferPortalFromLoginData, persistLoginSession } from "@/lib/auth-session";
import { syncHospitalProfileFlagsFromLoginUser } from "@/lib/hospital-profile-storage";
import { authService } from "@/services/auth.service";
import type { APIError } from "@/types/api";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const clearAuthError = () => setAuthError(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAuthError();
    const form = event.currentTarget;
    const fd = new FormData(form);
    /** Prefer FormData so password-manager autofill still submits even if React state missed `onChange`. */
    const emailTrimmed = String(fd.get("email") ?? "").trim() || email.trim();
    const passwordUsed = String(fd.get("password") ?? "") || password;

    if (!emailTrimmed) {
      toast.error("Please enter your email.");
      return;
    }
    if (!passwordUsed) {
      toast.error("Please enter your password.");
      return;
    }
    if (emailTrimmed !== email) setEmail(emailTrimmed);
    if (passwordUsed !== password) setPassword(passwordUsed);

    setPending(true);
    try {
      /** Drop stale JWTs so login is not rejected (Bearer on `/auth/login/` → token_not_valid). */
      clearAuthSession();
      const data = await authService.login({ email: emailTrimmed, password: passwordUsed });
      persistLoginSession(data);
      syncHospitalProfileFlagsFromLoginUser(data.user);
      const portal = inferPortalFromLoginData(data as Record<string, unknown>);
      if (data.must_change_password) {
        toast.info("Password update required", {
          description: "Change your password in account settings when you can.",
        });
      }
      toast.success("Signed in successfully.", {
        description:
          portal == null ? "Choose hospital or patient to continue." : undefined,
      });
      if (portal === "patient") {
        router.push(ROUTES.patient.dashboard);
      } else if (portal === "hospital") {
        router.push(ROUTES.hospital.dashboard);
      } else {
        router.push(ROUTES.home);
      }
    } catch (error) {
      const raw = error as Partial<APIError>;
      const message =
        typeof raw.message === "string" && raw.message.trim()
          ? raw.message.trim()
          : "Sign-in failed. Please try again.";
      setAuthError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Medical professionals reviewing patient information" carouselActiveIndex={0} />
      }
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Welcome back"
          subtitle="Log in to manage patients"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <InputField
              id="login-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@hospital.org"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearAuthError();
              }}
            />
            <PasswordField
              id="login-password"
              name="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              error={authError ?? undefined}
              onChange={(e) => {
                setPassword(e.target.value);
                clearAuthError();
              }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-input-border text-onboarding-blue accent-onboarding-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onboarding-blue/30"
              />
              Remember me
            </label>
            <Link
              href="#"
              className="text-sm font-semibold text-onboarding-blue hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" fullWidth disabled={pending}>
            {pending ? "Signing in…" : "Login"}
          </Button>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.home}>
            Register Now
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
