/**
 * Shared plate styles for tiles and the detail sheet.
 * [data-ink] sets the plate colors; [data-motif] sets the overprint pattern and plate silhouette.
 * Fg/overprint pairs are picked so text holds AA against the plate.
 */
export const inkCss = /* css */ `
[data-ink] { --pad: clamp(14px, 6cqmin, 30px); }
[data-ink="blue"]   { --bg: var(--riso-blue);   --fg: var(--on-dark);  --ink2: var(--riso-pink); }
[data-ink="orange"] { --bg: var(--riso-orange); --fg: var(--on-light); --ink2: var(--riso-purple); }
[data-ink="purple"] { --bg: var(--riso-purple); --fg: var(--on-dark);  --ink2: var(--riso-yellow); }
[data-ink="yellow"] { --bg: var(--riso-yellow); --fg: var(--on-light); --ink2: var(--riso-blue); }
[data-ink="pink"]   { --bg: var(--riso-pink);   --fg: var(--on-light); --ink2: var(--riso-yellow); }
[data-ink="teal"]   { --bg: var(--riso-teal);   --fg: var(--on-dark);  --ink2: var(--riso-yellow); }
[data-ink="green"]  { --bg: var(--riso-green);  --fg: var(--on-light); --ink2: var(--riso-pink); }
[data-ink="red"]    { --bg: var(--riso-red);    --fg: var(--on-light); --ink2: var(--riso-yellow); }

[data-motif="halftone"] { --shape: 28px 34cqmin 28px 28px; }
[data-motif="zigzag"]   { --shape: 999px 999px 28px 28px; }
[data-motif="stars"]    { --shape: 28px; }
[data-motif="record"]   { --shape: 28px 46cqmin 28px 28px; }
[data-motif="glyph"]    { --shape: 6px; }
[data-motif="lanes"]    { --shape: 999px; }
[data-motif="scallop"]  { --shape: 64px 28px 28px 28px; }
[data-motif="checker"]  { --shape: 0; }

/* corner-shape plates (Chromium 139+). Other engines keep the rounded silhouettes above. */
@supports (corner-shape: squircle) {
  [data-motif="stars"]   { --shape: 28px 22cqmin 28px 28px; --corner: round bevel round round; }
  [data-motif="glyph"]   { --shape: 26px; --corner: scoop; --pad: clamp(30px, 6cqmin, 36px); }
  [data-motif="scallop"] { --shape: 72px 44px 44px 44px; --corner: squircle; }
  [data-motif="checker"] { --shape: 20px; --corner: notch; --pad: clamp(28px, 7cqmin, 34px); }
  [data-motif="halftone"] { --shape: 40px 34cqmin 40px 40px; --corner: squircle round squircle squircle; }
}

.motif-box { position: absolute; inset: 0; z-index: -1; pointer-events: none; container-type: size; }
.motif {
  position: absolute; inset: 0;
  transition: transform .5s cubic-bezier(.3, 1.5, .5, 1), background-position 1.2s linear;
}
[data-motif="halftone"] .motif {
  background:
    radial-gradient(circle at 84% 24%, var(--ink2) 0 16cqmin, transparent calc(16cqmin + 1px)),
    radial-gradient(circle, var(--ink2) 0 34%, transparent 36%) 0 0 / 12px 12px;
  mask-image: radial-gradient(circle at 84% 24%, #000 0 22cqmin, transparent 58cqmin);
}
[data-motif="zigzag"] .motif {
  background:
    linear-gradient(135deg, var(--ink2) 25%, transparent 25%) -14px 0 / 28px 28px,
    linear-gradient(225deg, var(--ink2) 25%, transparent 25%) -14px 0 / 28px 28px;
  mask-image: linear-gradient(to bottom, #000 0 18%, transparent 34%);
}
[data-motif="stars"] .motif {
  background:
    radial-gradient(circle at 80% 26%, var(--ink2) 0 12cqmin, transparent calc(12cqmin + 1px)),
    radial-gradient(ellipse 26cqmin 5cqmin at 80% 26%, transparent 0 72%, var(--ink2) 74% 88%, transparent 90%),
    radial-gradient(circle, var(--ink2) 0 1.4px, transparent 2px) 0 0 / 23px 29px,
    radial-gradient(circle, var(--ink2) 0 1px, transparent 1.6px) 11px 7px / 17px 13px;
  mask-image: linear-gradient(200deg, #000 0 40%, transparent 75%);
}
[data-motif="record"] .motif {
  background:
    radial-gradient(circle at 100% 0, var(--ink2) 0 10cqmin, transparent calc(10cqmin + 1px)),
    repeating-radial-gradient(circle at 100% 0, var(--ink2) 0 1.5px, transparent 2px 7px);
  mask-image: radial-gradient(circle at 100% 0, #000 0 56cqmin, transparent calc(56cqmin + 1px));
}
[data-motif="glyph"] .motif::after {
  content: "Ag"; position: absolute; inset-inline-end: -.02em; inset-block-end: -.3em;
  font: italic 700 96cqh/1 Georgia, "Times New Roman", serif; color: var(--ink2);
}
[data-motif="lanes"] .motif {
  background:
    linear-gradient(var(--ink2), var(--ink2)) 0 14% / 100% 3px no-repeat,
    repeating-linear-gradient(90deg, var(--ink2) 0 30px, transparent 30px 52px) 0 28% / 100% 7px no-repeat,
    linear-gradient(var(--ink2), var(--ink2)) 0 42% / 100% 3px no-repeat;
  mask-image: linear-gradient(to left, #000 0 45%, transparent 85%);
}
[data-motif="scallop"] .motif {
  background:
    radial-gradient(circle at 0 50%, transparent 0 9px, var(--ink2) 10px) 100% 0 / 26px 20px repeat-y,
    radial-gradient(circle, var(--ink2) 0 2.5px, transparent 3px) calc(100% - 34px) 5px / 14px 14px repeat-y;
  mask-image: linear-gradient(to left, #000 0 50px, transparent 52px);
}
[data-motif="checker"] .motif {
  background: conic-gradient(var(--ink2) 25%, transparent 0 50%, var(--ink2) 0 75%, transparent 0) 0 0 / 30px 30px;
  mask-image: linear-gradient(225deg, #000 0 20%, transparent 44%);
}
`;
