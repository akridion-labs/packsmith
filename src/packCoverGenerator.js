const colorThemes = {
  aiAgency: {
    accent: "#efbd63",
    signal: "#42d1a0",
    back: "#080b0d",
    glow: "#76a8ff",
  },
  saasLaunch: {
    accent: "#76a8ff",
    signal: "#42d1a0",
    back: "#070b14",
    glow: "#efbd63",
  },
  healthcareGrowth: {
    accent: "#42d1a0",
    signal: "#efbd63",
    back: "#07100d",
    glow: "#76a8ff",
  },
  custom: {
    accent: "#efbd63",
    signal: "#42d1a0",
    back: "#080b0d",
    glow: "#a98bff",
  },
};

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapWords(value = "", maxWords = 4) {
  const words = String(value).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return [words.join(" ")];
  return [words.slice(0, maxWords).join(" "), words.slice(maxWords, maxWords * 2).join(" ")].filter(Boolean);
}

export function buildPackCoverModel(pack) {
  const presetId = pack.presetId || pack.id || "custom";
  const theme = colorThemes[presetId] || colorThemes.custom;
  return {
    title: pack.shortName || pack.name || "Packsmith Kit",
    subtitle: pack.promise || pack.listing?.description || "Launch-ready template pack",
    badge: pack.marketplaceTarget || "Gumroad",
    price: pack.suggestedPrice || pack.comparison?.expectedPrice || "$79",
    score: pack.quality?.overall || 88,
    theme,
    format: "1600x1200",
  };
}

export function buildPackCoverSvg(pack) {
  const model = buildPackCoverModel(pack);
  const titleLines = wrapWords(model.title, 3);
  const subtitleLines = wrapWords(model.subtitle, 8).slice(0, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img" aria-label="${escapeXml(model.title)} cover">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${model.theme.back}"/>
      <stop offset="0.56" stop-color="#111719"/>
      <stop offset="1" stop-color="#050607"/>
    </linearGradient>
    <radialGradient id="glowA" cx="18%" cy="16%" r="48%">
      <stop offset="0" stop-color="${model.theme.accent}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${model.theme.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="88%" cy="84%" r="44%">
      <stop offset="0" stop-color="${model.theme.signal}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${model.theme.signal}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="${model.theme.accent}" stroke-opacity="0.13" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="32" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="1600" height="1200" fill="url(#bg)"/>
  <rect width="1600" height="1200" fill="url(#glowA)"/>
  <rect width="1600" height="1200" fill="url(#glowB)"/>
  <rect width="1600" height="1200" fill="url(#grid)" opacity="0.7"/>
  <g transform="translate(120 110)" filter="url(#shadow)">
    <rect width="1360" height="980" rx="34" fill="#0b1012" fill-opacity="0.84" stroke="${model.theme.accent}" stroke-opacity="0.42"/>
    <path d="M0 92 H1360" stroke="${model.theme.accent}" stroke-opacity="0.18"/>
    <circle cx="56" cy="46" r="13" fill="${model.theme.accent}"/>
    <circle cx="96" cy="46" r="13" fill="${model.theme.signal}"/>
    <circle cx="136" cy="46" r="13" fill="${model.theme.glow}"/>
    <text x="1220" y="54" fill="#aeb7b0" font-family="Inter, Arial, sans-serif" font-size="24" text-anchor="end">packsmith://cover</text>
    <text x="76" y="178" fill="${model.theme.accent}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="2">${escapeXml(model.badge)}</text>
    ${titleLines.map((line, index) => `<text x="76" y="${310 + index * 112}" fill="#f7f1e5" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="900">${escapeXml(line)}</text>`).join("")}
    ${subtitleLines.map((line, index) => `<text x="80" y="${570 + index * 44}" fill="#aeb7b0" font-family="Inter, Arial, sans-serif" font-size="34">${escapeXml(line)}</text>`).join("")}
    <g transform="translate(80 720)">
      <rect width="346" height="142" rx="20" fill="${model.theme.signal}" fill-opacity="0.12" stroke="${model.theme.signal}" stroke-opacity="0.38"/>
      <text x="28" y="54" fill="#aeb7b0" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">QUALITY</text>
      <text x="28" y="112" fill="${model.theme.signal}" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="900">${escapeXml(model.score)}/100</text>
    </g>
    <g transform="translate(462 720)">
      <rect width="346" height="142" rx="20" fill="${model.theme.accent}" fill-opacity="0.12" stroke="${model.theme.accent}" stroke-opacity="0.38"/>
      <text x="28" y="54" fill="#aeb7b0" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">TEST PRICE</text>
      <text x="28" y="112" fill="${model.theme.accent}" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="900">${escapeXml(model.price)}</text>
    </g>
    <g transform="translate(900 650)">
      <rect width="310" height="42" rx="12" fill="#ffffff" fill-opacity="0.08"/>
      <rect width="420" height="42" y="70" rx="12" fill="${model.theme.accent}" fill-opacity="0.18"/>
      <rect width="260" height="42" y="140" rx="12" fill="${model.theme.signal}" fill-opacity="0.18"/>
      <rect width="380" height="42" y="210" rx="12" fill="#ffffff" fill-opacity="0.08"/>
    </g>
  </g>
</svg>`;
}
