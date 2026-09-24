import React from "react";

export function USFlagBadge({ className = "h-4 w-6" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.5)] border border-white/20 align-middle ${className}`}
      title="United States"
      aria-label="USA Flag"
    >
      <svg
        viewBox="0 0 640 480"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fillRule="evenodd">
          {/* 13 stripes: 7 red, 6 white */}
          <path fill="#b22234" d="M0 0h640v480H0z" />
          <path
            stroke="#ffffff"
            strokeWidth="36.92"
            d="M0 55.4h640M0 129.2h640M0 203.1h640M0 276.9h640M0 350.8h640M0 424.6h640"
          />
          {/* Blue canton */}
          <path fill="#3c3b6e" d="M0 0h260v258.5H0z" />
          {/* 50 stars pattern simplified crisp matrix */}
          <g fill="#ffffff">
            {[
              [24, 24], [72, 24], [120, 24], [168, 24], [216, 24],
              [48, 48], [96, 48], [144, 48], [192, 48], [240, 48],
              [24, 72], [72, 72], [120, 72], [168, 72], [216, 72],
              [48, 96], [96, 96], [144, 96], [192, 96], [240, 96],
              [24, 120], [72, 120], [120, 120], [168, 120], [216, 120],
              [48, 144], [96, 144], [144, 144], [192, 144], [240, 144],
              [24, 168], [72, 168], [120, 168], [168, 168], [216, 168],
              [48, 192], [96, 192], [144, 192], [192, 192], [240, 192],
              [24, 216], [72, 216], [120, 216], [168, 216], [216, 216],
              [48, 240], [96, 240], [144, 240], [192, 240],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="6.5" />
            ))}
          </g>
        </g>
      </svg>
    </span>
  );
}

export function LocationWithFlag({
  text,
  className = "",
  flagClassName,
}: {
  text?: string;
  className?: string;
  flagClassName?: string;
}) {
  if (!text) return null;

  const hasFlagEmoji = text.includes("🇺🇸");
  const isUsa = hasFlagEmoji || /\b(usa|united states|chicago)\b/i.test(text);

  // Clean out the raw 🇺🇸 emoji so Windows doesn't render awkward [U][S] text letters
  const cleanText = text.replace(/🇺🇸\s*/g, "").trim();

  if (isUsa) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <USFlagBadge className={flagClassName} />
        <span>{cleanText || "Chicago, IL, USA"}</span>
      </span>
    );
  }

  return <span className={className}>{text}</span>;
}
