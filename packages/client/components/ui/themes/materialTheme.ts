import {
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";

import {
  CatppuccinFlavor,
  SelectedTheme,
  TypeTheme,
} from "@revolt/state/stores/Theme";

/**
 * Generate the Material variables from the given properties
 *
 * Currently only generates color keys
 */
export function createMaterialColourVariables<P extends string>(
  theme: SelectedTheme,
  prefix: P,
): addPrefixToObject<MaterialColours, P> {
  switch (theme.preset) {
    case "you":
      return Object.entries(
        createCatppuccinScheme(
          theme.accent,
          theme.darkMode,
          theme.catppuccinFlavor,
        ),
      ).reduce(
        (d, [key, value]) => ({
          ...d,
          [`${prefix}${key}`]: value,
        }),
        {} as addPrefixToObject<MaterialColours, P>,
      );
    default:
      return {} as never;
  }
}

/**
 * Create R,G,B triplets for MDUI variables
 */
export function createMduiColourTriplets<P extends string>(
  theme: SelectedTheme,
  prefix: P,
): addPrefixToObject<MaterialColours, P> {
  const variables = createMaterialColourVariables(theme, prefix);

  for (const key in variables) {
    const [_, r, g, b] = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i.exec(
      variables[key as keyof typeof variables] as string,
    )!;

    variables[key as keyof typeof variables] =
      `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}` as never;
  }

  return variables;
}

type addPrefixToObject<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K];
};

type _addSuffixToObject<T, S extends string> = {
  [K in keyof T as K extends string ? `${K}${S}` : never]: T[K];
};

type MaterialColours = {
  primary: string;
  "on-primary": string;
  "primary-container": string;
  "on-primary-container": string;
  secondary: string;
  "on-secondary": string;
  "secondary-container": string;
  "on-secondary-container": string;
  tertiary: string;
  "on-tertiary": string;
  "tertiary-container": string;
  "on-tertiary-container": string;
  error: string;
  "on-error": string;
  "error-container": string;
  "on-error-container": string;

  "primary-fixed": string;
  "primary-fixed-dim": string;
  "on-primary-fixed": string;
  "on-primary-fixed-variant": string;
  "secondary-fixed": string;
  "secondary-fixed-dim": string;
  "on-secondary-fixed": string;
  "on-secondary-fixed-variant": string;
  "tertiary-fixed": string;
  "tertiary-fixed-dim": string;
  "on-tertiary-fixed": string;
  "on-tertiary-fixed-variant": string;

  "surface-dim": string;
  surface: string;
  "surface-bright": string;

  "surface-container-lowest": string;
  "surface-container-low": string;
  "surface-container": string;
  "surface-container-high": string;
  "surface-container-highest": string;

  "on-surface": string;
  "on-surface-variant": string;
  outline: string;
  "outline-variant": string;

  "inverse-surface": string;
  "inverse-on-surface": string;
  "inverse-primary": string;

  scrim: string;
  shadow: string;
};

const CATPPUCCIN_FLAVOURS: Record<
  CatppuccinFlavor,
  {
    base: string;
    mantle: string;
    crust: string;
    text: string;
    subtext: string;
    overlay: string;
    surface0: string;
    surface1: string;
    surface2: string;
    rosewater: string;
    flamingo: string;
    pink: string;
    mauve: string;
    red: string;
    maroon: string;
    peach: string;
    yellow: string;
    green: string;
    teal: string;
    sky: string;
    sapphire: string;
    blue: string;
    lavender: string;
  }
> = {
  latte: {
    base: "#eff1f5",
    mantle: "#e6e9ef",
    crust: "#dfe8dc",
    text: "#4c4f69",
    subtext: "#2137d8",
    overlay: "#d2d4dd",
    surface0: "#e6e8ee",
    surface1: "#e3e5e9",
    surface2: "#eff1f5",
    rosewater: "#dc8a78",
    flamingo: "#dd7878",
    pink: "#ea76cb",
    mauve: "#8839ef",
    red: "#d20f39",
    maroon: "#e64553",
    peach: "#fe640b",
    yellow: "#df8e1d",
    green: "#40a02b",
    teal: "#179299",
    sky: "#04a5e5",
    sapphire: "#209fb5",
    blue: "#1e66f5",
    lavender: "#7287fd",
  },
  frappe: {
    base: "#303446",
    mantle: "#292c3c",
    crust: "#232634",
    text: "#c6d0f5",
    subtext: "#b5bfd9",
    overlay: "#303446",
    surface0: "#303446",
    surface1: "#303446",
    surface2: "#303446",
    rosewater: "#f2d5cf",
    flamingo: "#eebebe",
    pink: "#f4b8e4",
    mauve: "#ca9ee6",
    red: "#e78284",
    maroon: "#ea999c",
    peach: "#ef9f76",
    yellow: "#e5c890",
    green: "#a6d189",
    teal: "#81c8be",
    sky: "#99d1db",
    sapphire: "#85c1dc",
    blue: "#8caaee",
    lavender: "#babbf1",
  },
  macchiato: {
    base: "#24273a",
    mantle: "#1e2030",
    crust: "#181926",
    text: "#cad3f5",
    subtext: "#b8c0e0",
    overlay: "#24273a",
    surface0: "#24273a",
    surface1: "#24273a",
    surface2: "#24273a",
    rosewater: "#f4dbd6",
    flamingo: "#f0c6c6",
    pink: "#f5bde6",
    mauve: "#c6a0f6",
    red: "#ed8796",
    maroon: "#ee99a0",
    peach: "#f5a97f",
    yellow: "#eed49f",
    green: "#a6da95",
    teal: "#8bd5ca",
    sky: "#91d7e3",
    sapphire: "#7dc4e4",
    blue: "#8aadf4",
    lavender: "#b7bdf8",
  },
  mocha: {
    base: "#1e1e2e",
    mantle: "#181825",
    crust: "#11111b",
    text: "#cdd6f4",
    subtext: "#bac2de",
    overlay: "#1e1e2e",
    surface0: "#1e1e2e",
    surface1: "#1e1e2e",
    surface2: "#1e1e2e",
    rosewater: "#f5e0dc",
    flamingo: "#f2cdcd",
    pink: "#f5c2e7",
    mauve: "#cba6f7",
    red: "#f38ba8",
    maroon: "#eba0ac",
    peach: "#fab387",
    yellow: "#f9e2af",
    green: "#a6e3a1",
    teal: "#94e2d5",
    sky: "#89dceb",
    sapphire: "#74c7ec",
    blue: "#89b4fa",
    lavender: "#b4befe",
  },
};

function hexToRgb(hex: string) {
  const normalised = hex.replace("#", "");
  const value =
    normalised.length === 3
      ? normalised
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalised.slice(0, 6);

  const num = Number.parseInt(value, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function blend(hexA: string, hexB: string, weight: number) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * weight);

  return rgbToHex(mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b));
}

function readTextColour(background: string) {
  const { r, g, b } = hexToRgb(background);
  const luminance = [r, g, b]
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (value, channel, index) =>
        value + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
  const contrast = (textLuminance: number) =>
    (Math.max(luminance, textLuminance) + 0.05) /
    (Math.min(luminance, textLuminance) + 0.05);

  return contrast(0.0) >= contrast(1.0) ? "#11111b" : "#eff1f5";
}

function getAccentFromFlavor(flavor: CatppuccinFlavor, accent: string) {
  const palette = CATPPUCCIN_FLAVOURS[flavor];
  const normalized = accent.toLowerCase();

  if (
    Object.values(palette)
      .map((value) => value.toLowerCase())
      .includes(normalized)
  ) {
    return accent;
  }

  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(normalized)
    ? accent
    : palette.blue;
}

function createCatppuccinScheme(
  accent: string,
  darkMode: boolean,
  flavor: CatppuccinFlavor,
): MaterialColours {
  const palette = CATPPUCCIN_FLAVOURS[flavor];
  const resolvedAccent = getAccentFromFlavor(flavor, accent);
  const accentContainer = resolvedAccent;
  const secondary = darkMode ? palette.mauve : palette.lavender;
  const tertiary = darkMode ? palette.teal : palette.sky;
  const surfaceBase = darkMode ? palette.base : palette.base;
  const surfaceContainerLow = darkMode ? palette.mantle : palette.surface0;
  const surfaceContainer = darkMode ? palette.surface0 : palette.surface1;
  const surfaceContainerHigh = darkMode ? palette.surface1 : palette.surface2;
  const surfaceContainerHighest = darkMode ? palette.surface2 : palette.mantle;
  const softTertiaryContainer = darkMode
    ? blend(tertiary, palette.base, 0.72)
    : blend(tertiary, palette.base, 0.58);

  const scheme = {
    primary: resolvedAccent,
    "on-primary": readTextColour(resolvedAccent),
    "primary-container": accentContainer,
    "on-primary-container": readTextColour(accentContainer),
    secondary,
    "on-secondary": readTextColour(secondary),
    "secondary-container": resolvedAccent,
    "on-secondary-container": readTextColour(resolvedAccent),
    tertiary,
    "on-tertiary": readTextColour(tertiary),
    "tertiary-container": softTertiaryContainer,
    "on-tertiary-container": darkMode ? palette.text : "#0019fd",
    error: palette.red,
    "on-error": readTextColour(palette.red),
    "error-container": darkMode
      ? blend(palette.red, palette.base, 0.25)
      : blend(palette.red, palette.base, 0.18),
    "on-error-container": readTextColour(
      darkMode
        ? blend(palette.red, palette.base, 0.25)
        : blend(palette.red, palette.base, 0.18),
    ),

    "primary-fixed": resolvedAccent,
    "primary-fixed-dim": darkMode
      ? blend(resolvedAccent, palette.base, 0.15)
      : blend(resolvedAccent, palette.base, 0.1),
    "on-primary-fixed": readTextColour(resolvedAccent),
    "on-primary-fixed-variant": readTextColour(
      darkMode
        ? blend(resolvedAccent, palette.base, 0.15)
        : blend(resolvedAccent, palette.base, 0.1),
    ),
    "secondary-fixed": secondary,
    "secondary-fixed-dim": darkMode
      ? blend(secondary, palette.base, 0.15)
      : blend(secondary, palette.base, 0.1),
    "on-secondary-fixed": readTextColour(secondary),
    "on-secondary-fixed-variant": readTextColour(
      darkMode
        ? blend(secondary, palette.base, 0.15)
        : blend(secondary, palette.base, 0.1),
    ),
    "tertiary-fixed": tertiary,
    "tertiary-fixed-dim": darkMode
      ? blend(tertiary, palette.base, 0.15)
      : blend(tertiary, palette.base, 0.1),
    "on-tertiary-fixed": readTextColour(tertiary),
    "on-tertiary-fixed-variant": readTextColour(
      darkMode
        ? blend(tertiary, palette.base, 0.15)
        : blend(tertiary, palette.base, 0.1),
    ),

    "surface-dim": darkMode ? palette.crust : palette.mantle,
    surface: surfaceBase,
    "surface-bright": darkMode ? palette.surface2 : palette.surface0,

    "surface-container-lowest": darkMode ? palette.crust : palette.base,
    "surface-container-low": surfaceContainerLow,
    "surface-container": surfaceContainer,
    "surface-container-high": surfaceContainerHigh,
    "surface-container-highest": surfaceContainerHighest,

    "on-surface": palette.text,
    "on-surface-variant": darkMode ? "#bac2de" : "#6c6f85",
    outline: palette.overlay,
    "outline-variant": darkMode ? palette.surface1 : palette.surface2,

    "inverse-surface": darkMode ? palette.base : palette.crust,
    "inverse-on-surface": palette.text,
    "inverse-primary": darkMode ? palette.lavender : palette.blue,

    scrim: "#000000",
    shadow: "#000000",
  };

  return scheme;
}

/**
 * Generate a Material You colour scheme
 * @param accent Accent colour in hex format
 * @param darkMode Dark mode
 * @param constrat Constrast level
 * @returns Material colours
 */
function generateMaterialYouScheme(
  accent: string,
  darkMode: boolean,
  contrast: number,
  variant: TypeTheme["m3Variant"],
): MaterialColours {
  const hct = Hct.fromInt(argbFromHex(accent));

  let scheme;
  switch (variant) {
    case "content":
      scheme = new SchemeContent(hct, darkMode, contrast);
      break;
    case "expressive":
      scheme = new SchemeExpressive(hct, darkMode, contrast);
      break;
    case "fidelity":
      scheme = new SchemeFidelity(hct, darkMode, contrast);
      break;
    case "fruit_salad":
      scheme = new SchemeFruitSalad(hct, darkMode, contrast);
      break;
    case "monochrome":
      scheme = new SchemeMonochrome(hct, darkMode, contrast);
      break;
    case "neutral":
      scheme = new SchemeNeutral(hct, darkMode, contrast);
      break;
    case "rainbow":
      scheme = new SchemeRainbow(hct, darkMode, contrast);
      break;
    case "vibrant":
      scheme = new SchemeVibrant(hct, darkMode, contrast);
      break;
    case "tonal_spot":
    default:
      scheme = new SchemeTonalSpot(hct, darkMode, contrast);
      break;
  }

  return {
    primary: hexFromArgb(scheme.primary),
    "on-primary": hexFromArgb(scheme.onPrimary),
    "primary-container": hexFromArgb(scheme.primaryContainer),
    "on-primary-container": hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    "on-secondary": hexFromArgb(scheme.onSecondary),
    "secondary-container": hexFromArgb(scheme.secondaryContainer),
    "on-secondary-container": hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    "on-tertiary": hexFromArgb(scheme.onTertiary),
    "tertiary-container": hexFromArgb(scheme.tertiaryContainer),
    "on-tertiary-container": hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    "on-error": hexFromArgb(scheme.onError),
    "error-container": hexFromArgb(scheme.errorContainer),
    "on-error-container": hexFromArgb(scheme.onErrorContainer),

    "primary-fixed": hexFromArgb(scheme.primaryFixed),
    "primary-fixed-dim": hexFromArgb(scheme.primaryFixedDim),
    "on-primary-fixed": hexFromArgb(scheme.onPrimaryFixed),
    "on-primary-fixed-variant": hexFromArgb(scheme.onPrimaryFixedVariant),
    "secondary-fixed": hexFromArgb(scheme.secondaryFixed),
    "secondary-fixed-dim": hexFromArgb(scheme.onSecondaryFixed),
    "on-secondary-fixed": hexFromArgb(scheme.onSecondaryFixed),
    "on-secondary-fixed-variant": hexFromArgb(scheme.onSecondaryFixedVariant),
    "tertiary-fixed": hexFromArgb(scheme.tertiaryFixed),
    "tertiary-fixed-dim": hexFromArgb(scheme.tertiaryFixedDim),
    "on-tertiary-fixed": hexFromArgb(scheme.onTertiaryFixed),
    "on-tertiary-fixed-variant": hexFromArgb(scheme.onTertiaryFixedVariant),

    "surface-dim": hexFromArgb(scheme.surfaceDim),
    surface: hexFromArgb(scheme.surface),
    "surface-bright": hexFromArgb(scheme.surfaceBright),

    "surface-container-lowest": hexFromArgb(scheme.surfaceContainerLowest),
    "surface-container-low": hexFromArgb(scheme.surfaceContainerLow),
    "surface-container": hexFromArgb(scheme.surfaceContainer),
    "surface-container-high": hexFromArgb(scheme.surfaceContainerHigh),
    "surface-container-highest": hexFromArgb(scheme.surfaceContainerHighest),

    "on-surface": hexFromArgb(scheme.onSurface),
    "on-surface-variant": hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    "outline-variant": hexFromArgb(scheme.outlineVariant),

    "inverse-surface": hexFromArgb(scheme.inverseSurface),
    "inverse-on-surface": hexFromArgb(scheme.inverseOnSurface),
    "inverse-primary": hexFromArgb(scheme.inversePrimary),

    scrim: hexFromArgb(scheme.scrim),
    shadow: hexFromArgb(scheme.shadow),
  };
}
