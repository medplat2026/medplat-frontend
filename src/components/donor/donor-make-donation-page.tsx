"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MOCK_DONOR_MAKE_DONATION } from "@/data/mock-donor-make-donation";
import { cn } from "@/lib/utils";

const NAIRA = "\u20A6";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function parseNairaInput(s: string): number {
  const d = digitsOnly(s);
  if (d === "") return 0;
  const n = Number(d);
  return Number.isFinite(n) ? n : 0;
}

function formatNairaInteger(n: number): string {
  return n.toLocaleString("en-NG");
}

function AnonymityToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onboarding-blue",
        checked ? "bg-onboarding-blue" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "absolute top-1 size-6 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-7" : "translate-x-1",
        )}
        aria-hidden
      />
    </button>
  );
}

export function DonorMakeDonationPage() {
  const m = MOCK_DONOR_MAKE_DONATION;
  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState("0");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const n = parseNairaInput(raw);
    setAmount(n);
    setAmountInput(raw === "" || digitsOnly(raw) === "" ? "" : formatNairaInteger(n));
  };

  const onAmountBlur = () => {
    if (amountInput === "" || amount === 0) {
      setAmount(0);
      setAmountInput("0");
    } else {
      setAmountInput(formatNairaInteger(amount));
    }
  };

  const onQuickSelect = (n: number) => {
    setAmount(n);
    setAmountInput(formatNairaInteger(n));
  };

  const canProceed = amount > 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero — Figma: gradient blue → light; square photo; white title stack */}
      <section
        className={cn(
          "-mx-4 bg-linear-to-r from-[#007bff] via-sky-100/90 to-white px-4 py-8 md:-mx-6 md:px-6 md:py-10 lg:-mx-8 lg:px-8",
        )}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative size-[104px] shrink-0 overflow-hidden rounded-3xl border border-white/40 shadow-lg shadow-slate-900/15 sm:size-[120px]">
            <Image
              src={m.patient.photoUrl}
              alt={`${m.patient.displayName} — profile photo`}
              fill
              className="object-cover"
              sizes="120px"
              priority
            />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {m.patient.supportHeadline}
            </h2>
            <p className="mt-1 text-lg font-normal text-white/95 sm:text-xl">{m.patient.condition}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8">
        {/* Amount */}
        <section>
          <label htmlFor="donation-amount" className="text-sm font-bold text-slate-900">
            Enter Donation Amount
          </label>
          <div className="mt-3 flex min-h-22 items-baseline gap-2 rounded-xl border border-slate-200 bg-white px-5 py-5 sm:min-h-24 sm:px-7 sm:py-6">
            <span className="select-none text-2xl font-normal text-slate-400 sm:text-3xl" aria-hidden>
              {NAIRA}
            </span>
            <input
              id="donation-amount"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-describedby="donation-quick-hint"
              className="min-w-0 flex-1 border-0 bg-transparent text-3xl font-bold tracking-tight text-slate-800 outline-none placeholder:text-slate-300 sm:text-4xl"
              value={amountInput}
              onChange={onAmountChange}
              onBlur={onAmountBlur}
              onFocus={(e) => {
                if (amount === 0 && e.target.value === "0") {
                  setAmountInput("");
                }
              }}
            />
          </div>
          <p id="donation-quick-hint" className="sr-only">
            Or choose a quick amount below.
          </p>
          <p className="mt-4 text-sm text-slate-500">Quick select</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {m.quickAmounts.map((n) => {
              const active = amount === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onQuickSelect(n)}
                  className={cn(
                    "rounded-lg border px-3 py-3 text-center text-sm font-bold text-slate-900 transition-colors",
                    "border-sky-300 bg-white hover:bg-sky-50/80",
                    active && "border-onboarding-blue bg-sky-50 ring-1 ring-onboarding-blue/30",
                  )}
                >
                  <span className="font-normal text-slate-500">{NAIRA}</span> {formatNairaInteger(n)}
                </button>
              );
            })}
          </div>
        </section>

        {/* Anonymity */}
        <section
          className={cn(
            "flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-[#f4f5f7] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
          )}
        >
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-900">Donate Anonymously</p>
            <p className="mt-1 text-sm text-slate-500">Your name will not be shown publicly</p>
          </div>
          <AnonymityToggle checked={anonymous} onCheckedChange={setAnonymous} />
        </section>

        {/* Message */}
        <section>
          <label htmlFor="donation-message" className="text-base font-semibold text-slate-900">
            Leave a Message (Optional)
          </label>
          <textarea
            id="donation-message"
            rows={4}
            placeholder={m.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-onboarding-blue focus:outline-none focus:ring-2 focus:ring-onboarding-blue/25"
          />
        </section>

        {/* Impact + payment — Figma: equal row height; action block bottom-aligned */}
        <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center rounded-2xl bg-sky-50 p-6 shadow-sm ring-1 ring-sky-100/80">
            <div className="flex items-center gap-2">
              <svg className="size-5 shrink-0 text-onboarding-blue" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-base font-semibold text-slate-900">{m.impact.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.impact.body}</p>
          </div>
          <div className="flex min-h-0 flex-col justify-end gap-4 lg:min-h-[140px]">
            {canProceed ? (
              <Button
                type="button"
                variant="brand"
                fullWidth
                className="h-12 rounded-xl text-base font-semibold shadow-sm"
              >
                Proceed to Payment
              </Button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-300 text-base font-semibold text-white shadow-sm"
              >
                Proceed to Payment
              </button>
            )}
            <p className="flex items-start gap-2 text-sm text-slate-500">
              <span
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500"
                aria-hidden
              >
                ✓
              </span>
              {m.termsLine}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
