import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/webmail")({
  component: WebmailRedirect,
});

function WebmailRedirect() {
  useEffect(() => {
    window.location.replace("https://webmail.motionintech.com");
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neon border-t-transparent mb-6" style={{ borderColor: "var(--color-neon)", borderTopColor: "transparent" }} />
      <h2 className="font-display text-2xl font-bold mb-2">Redirecting to Webmail...</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Taking you to your secure email login at{" "}
        <a
          href="https://webmail.motionintech.com"
          className="text-neon underline hover:opacity-80"
          style={{ color: "var(--color-neon)" }}
        >
          webmail.motionintech.com
        </a>.
      </p>
    </div>
  );
}
