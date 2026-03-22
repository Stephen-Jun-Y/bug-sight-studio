import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
};

const classId = getArg("--classId", "67");
const outputPath = getArg("--output", "");

if (!outputPath) {
  console.error("Missing required --output <path>");
  process.exit(1);
}

const covers = {
  "67": {
    zhName: "斑衣蜡蝉",
    latinName: "Lycorma delicatula",
  },
};

const cover = covers[classId];

if (!cover) {
  console.error(`Unsupported classId: ${classId}`);
  process.exit(1);
}

const svg = String.raw`<svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="120" y1="90" x2="1080" y2="1510" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#E4F0D4"/>
      <stop offset="0.42" stop-color="#9FC47F"/>
      <stop offset="1" stop-color="#365C31"/>
    </linearGradient>
    <radialGradient id="glowTop" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(330 310) rotate(90) scale(360 400)">
      <stop stop-color="white" stop-opacity="0.74"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowRight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(930 430) rotate(90) scale(240 240)">
      <stop stop-color="#FFF4D8" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#FFF4D8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="leafGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(660 1290) rotate(90) scale(360 420)">
      <stop stop-color="#254A25" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#254A25" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="foreWing" x1="0" y1="0" x2="0" y2="380" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E7D9C6"/>
      <stop offset="0.58" stop-color="#D1C1AE"/>
      <stop offset="1" stop-color="#AB9884"/>
    </linearGradient>
    <linearGradient id="hindWing" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF7860"/>
      <stop offset="0.58" stop-color="#EC533A"/>
      <stop offset="1" stop-color="#2B2420"/>
    </linearGradient>
    <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
      <stop stop-color="#201B1A"/>
      <stop offset="1" stop-color="#46352A"/>
    </linearGradient>
    <filter id="softBlur" x="-200" y="-200" width="1600" height="2000" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="48"/>
    </filter>
    <filter id="shadow" x="120" y="250" width="980" height="1060" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feOffset dy="24"/>
      <feGaussianBlur stdDeviation="30"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.08 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0.28 0"/>
      <feBlend in="SourceGraphic" mode="normal"/>
    </filter>
    <filter id="wingSoftener" x="150" y="260" width="900" height="1020" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="0.35"/>
    </filter>
  </defs>

  <rect width="1200" height="1600" rx="120" fill="url(#bgGradient)"/>

  <g filter="url(#softBlur)">
    <circle cx="260" cy="290" r="170" fill="url(#glowTop)"/>
    <circle cx="950" cy="420" r="140" fill="url(#glowRight)"/>
    <circle cx="650" cy="1260" r="210" fill="url(#leafGlow)"/>
    <circle cx="170" cy="1100" r="110" fill="#7AB267" fill-opacity="0.24"/>
    <circle cx="1000" cy="1180" r="90" fill="#F4F4D8" fill-opacity="0.2"/>
  </g>

  <g opacity="0.48">
    <ellipse cx="220" cy="1280" rx="170" ry="80" fill="#6EA05C" fill-opacity="0.45" transform="rotate(-24 220 1280)"/>
    <ellipse cx="980" cy="1210" rx="160" ry="74" fill="#7FB56A" fill-opacity="0.32" transform="rotate(18 980 1210)"/>
    <ellipse cx="930" cy="220" rx="120" ry="56" fill="#EDF5D8" fill-opacity="0.2" transform="rotate(-20 930 220)"/>
  </g>

  <g filter="url(#shadow)">
    <g transform="translate(610 785) rotate(-13) translate(-610 -785)" filter="url(#wingSoftener)">
      <g transform="translate(0 20)">
        <path d="M555 640C455 575 320 560 230 690C288 706 354 739 430 804C488 853 525 918 540 1008C584 950 612 877 619 794C623 736 603 684 555 640Z" fill="url(#hindWing)"/>
        <path d="M665 640C765 575 900 560 990 690C932 706 866 739 790 804C732 853 695 918 680 1008C636 950 608 877 601 794C597 736 617 684 665 640Z" fill="url(#hindWing)"/>
        <path d="M532 572C437 468 296 437 172 556C244 592 322 651 406 744C474 820 524 908 540 1035C587 975 624 892 646 784C666 689 629 622 532 572Z" fill="url(#foreWing)"/>
        <path d="M688 572C783 468 924 437 1048 556C976 592 898 651 814 744C746 820 696 908 680 1035C633 975 596 892 574 784C554 689 591 622 688 572Z" fill="url(#foreWing)"/>

        <g fill="#F7EFE7" fill-opacity="0.84">
          <ellipse cx="321" cy="610" rx="26" ry="20" transform="rotate(-22 321 610)"/>
          <ellipse cx="390" cy="638" rx="18" ry="14" transform="rotate(8 390 638)"/>
          <ellipse cx="282" cy="690" rx="19" ry="15" transform="rotate(-10 282 690)"/>
          <ellipse cx="446" cy="712" rx="21" ry="16" transform="rotate(12 446 712)"/>
          <ellipse cx="320" cy="785" rx="18" ry="14" transform="rotate(-18 320 785)"/>
          <ellipse cx="430" cy="826" rx="16" ry="12" transform="rotate(16 430 826)"/>
          <ellipse cx="857" cy="610" rx="26" ry="20" transform="rotate(22 857 610)"/>
          <ellipse cx="788" cy="638" rx="18" ry="14" transform="rotate(-8 788 638)"/>
          <ellipse cx="896" cy="690" rx="19" ry="15" transform="rotate(10 896 690)"/>
          <ellipse cx="732" cy="712" rx="21" ry="16" transform="rotate(-12 732 712)"/>
          <ellipse cx="858" cy="785" rx="18" ry="14" transform="rotate(18 858 785)"/>
          <ellipse cx="748" cy="826" rx="16" ry="12" transform="rotate(-16 748 826)"/>
        </g>

        <g fill="#2D2522" fill-opacity="0.94">
          <circle cx="235" cy="620" r="12"/>
          <circle cx="264" cy="655" r="10"/>
          <circle cx="300" cy="732" r="10"/>
          <circle cx="354" cy="780" r="11"/>
          <circle cx="400" cy="850" r="9"/>
          <circle cx="962" cy="620" r="12"/>
          <circle cx="933" cy="655" r="10"/>
          <circle cx="897" cy="732" r="10"/>
          <circle cx="843" cy="780" r="11"/>
          <circle cx="797" cy="850" r="9"/>
        </g>

        <g stroke="#F9D7D1" stroke-width="6" stroke-linecap="round" opacity="0.62">
          <path d="M430 804C396 770 362 742 323 716"/>
          <path d="M468 882C427 842 391 810 350 786"/>
          <path d="M790 804C824 770 858 742 897 716"/>
          <path d="M752 882C793 842 829 810 870 786"/>
        </g>
      </g>

      <g>
        <ellipse cx="610" cy="760" rx="56" ry="122" fill="url(#bodyGradient)"/>
        <ellipse cx="610" cy="650" rx="40" ry="50" fill="#171211"/>
        <ellipse cx="610" cy="850" rx="48" ry="66" fill="#5B4233"/>
        <ellipse cx="610" cy="969" rx="30" ry="58" fill="#473529"/>
        <circle cx="592" cy="642" r="6" fill="#F0E4D9"/>
        <circle cx="628" cy="642" r="6" fill="#F0E4D9"/>
        <circle cx="596" cy="684" r="7" fill="#F0E4D9"/>
        <circle cx="624" cy="684" r="7" fill="#F0E4D9"/>
        <circle cx="594" cy="731" r="6" fill="#F0E4D9"/>
        <circle cx="626" cy="731" r="6" fill="#F0E4D9"/>
        <circle cx="596" cy="778" r="6" fill="#E2D6CA"/>
        <circle cx="624" cy="778" r="6" fill="#E2D6CA"/>
        <path d="M586 600C568 546 548 510 520 478" stroke="#161211" stroke-width="8" stroke-linecap="round"/>
        <path d="M634 600C652 546 672 510 700 478" stroke="#161211" stroke-width="8" stroke-linecap="round"/>
        <path d="M570 820C506 855 450 905 398 980" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
        <path d="M572 876C514 933 475 991 440 1072" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
        <path d="M580 932C540 997 517 1062 500 1136" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
        <path d="M650 820C714 855 770 905 822 980" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
        <path d="M648 876C706 933 745 991 780 1072" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
        <path d="M640 932C680 997 703 1062 720 1136" stroke="#302521" stroke-width="10" stroke-linecap="round"/>
      </g>
    </g>
  </g>

  <g opacity="0.28">
    <circle cx="190" cy="310" r="24" fill="white"/>
    <circle cx="280" cy="360" r="12" fill="white"/>
    <circle cx="1020" cy="350" r="19" fill="#FFF6E8"/>
    <circle cx="945" cy="1188" r="16" fill="#F4F8DE"/>
    <circle cx="137" cy="1110" r="14" fill="#EEF8E2"/>
  </g>
</svg>
`;

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, svg, "utf8");

console.log(
  JSON.stringify({
    classId,
    zhName: cover.zhName,
    latinName: cover.latinName,
    outputPath,
  }),
);
