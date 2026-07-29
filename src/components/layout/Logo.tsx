export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="400" height="400" fill="#0A0A0A" />
      <polygon
        points="200,42 328,116 328,262 200,354 72,262 72,116"
        fill="none"
        stroke="#D9B54A"
        strokeWidth="3"
      />
      <polygon
        points="200,60 311,124 311,254 200,336 89,254 89,124"
        fill="none"
        stroke="#D9B54A"
        strokeWidth="1.5"
      />
      <g stroke="#6B6636" strokeWidth="1" opacity="0.65">
        <line x1="72" y1="116" x2="328" y2="262" />
        <line x1="328" y1="116" x2="72" y2="262" />
        <line x1="200" y1="42" x2="72" y2="262" />
        <line x1="200" y1="42" x2="328" y2="262" />
        <line x1="200" y1="354" x2="72" y2="116" />
        <line x1="200" y1="354" x2="328" y2="116" />
      </g>
      <text
        x="200"
        y="196"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="15"
        letterSpacing="8"
        fill="#D9B54A"
      >
        TU
      </text>
      <text
        x="200"
        y="232"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="32"
        fontWeight="600"
        letterSpacing="3"
        fill="#D9B54A"
      >
        CAMISETA
      </text>
      <text
        x="200"
        y="264"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="13"
        letterSpacing="6"
        fill="#D9B54A"
      >
        . U Y .
      </text>
      <circle cx="200" cy="354" r="20" fill="#D9B54A" />
      <polygon
        points="200,345 208.6,351.2 205.3,361.3 194.7,361.3 191.4,351.2"
        fill="#0A0A0A"
      />
    </svg>
  );
}
