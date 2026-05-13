import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SocialLoginButtons({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      <Button type="button" variant="outline" className="py-3 text-xs font-semibold sm:text-sm">
        <GoogleGlyph className="size-4" />
        Login with Google
      </Button>
      <Button type="button" variant="outline" className="py-3 text-xs font-semibold sm:text-sm">
        <AppleGlyph className="size-4" />
        Login with Apple
      </Button>
    </div>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.7 3.9 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.4H12z"
      />
      <path
        fill="#34A853"
        d="M3.5 7.4C2.6 8.9 2 10.4 2 12c0 1.6.6 3.1 1.5 4.6l3.9-3c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L3.5 7.4z"
      />
      <path
        fill="#4A90E2"
        d="M12 22c2.4 0 4.5-.8 6-2.2l-2.8-2.2c-.8.5-1.8.9-3.2.9-2.4 0-4.5-1.6-5.2-3.9H3.2v.1C4.7 20.1 8.1 22 12 22z"
      />
      <path fill="#FBBC05" d="M12 5.8c1.3 0 2.2.5 3 1.1l2.2-2.2C15.9 3.3 14.1 2.5 12 2.5 8.1 2.5 4.7 4.4 3.2 7.3l3.6 2.8c.7-2.3 2.8-3.3 5.2-3.3z" />
    </svg>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16.7 2.1c.1 1.6-.5 3.1-1.5 4.2-.9 1-2.6 1.8-4 1.5-.2-1.5.5-3 1.5-4.1 1-1.1 2.8-1.9 4-1.6zm1.6 7.4c-2.5-.1-3.3 1.5-4.9 1.4-1.7-.1-2-1.4-4.2-1.4-2.2 0-2.9 1.4-4.6 1.5-1 .1-1.9-.3-2.6-.8C1.7 12.8.5 17.6 2.2 20.5c.8 1.4 2.2 2.4 3.8 2.4 1.4 0 2.1-.9 3.9-.9 1.8 0 2.2.9 3.9.9 1.7 0 2.9-1 3.7-2.3.7-1.1 1-2.3 1-3.5-2.2-1-2.6-3.2-2.4-4.6.2-1.4 1.1-2.6 2.1-3.3z"
      />
    </svg>
  );
}
