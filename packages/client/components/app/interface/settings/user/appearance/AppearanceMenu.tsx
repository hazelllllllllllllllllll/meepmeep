import { createSignal, For, Match, Show, Switch } from "solid-js";

import { Trans, useLingui } from "@lingui/solid/macro";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useUser } from "@revolt/client";
import {
  UNICODE_EMOJI_PACKS,
  UnicodeEmoji,
  UnicodeEmojiPacks,
} from "@revolt/markdown/emoji/UnicodeEmoji";
import { useState } from "@revolt/state";
import {
  Avatar,
  Button,
  Checkbox,
  Column,
  FloatingSelect,
  MenuItem,
  MessageContainer,
  Row,
  Slider,
  Text,
} from "@revolt/ui";
import {
  FONT_KEYS,
  FONTS,
  Fonts,
  MONOSPACE_FONT_KEYS,
  MONOSPACE_FONTS,
  MonospaceFonts,
} from "@revolt/ui/themes/fonts";

import MDPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";

/**
 * All appearance options for the client
 */
export function AppearanceMenu() {
  const user = useUser();
  const state = useState();
  const { t } = useLingui();
  const [pickerRef, setPickerRef] = createSignal<HTMLInputElement>();

  function loadFonts() {
    for (const f in FONTS) FONTS[f as Fonts].load();
  }

  function loadMonoFonts() {
    for (const f in MONOSPACE_FONTS)
      MONOSPACE_FONTS[f as MonospaceFonts].load();
  }

  const catppuccinPalette = () => {
    switch (state.theme.catppuccinFlavor) {
      case "latte":
        return [
          "#D20F39",
          "#E64553",
          "#DD7878",
          "#DC8A78",
          "#FE640B",
          "#DF8E1D",
          "#40A02B",
          "#179299",
          "#2A9D8F",
          "#209FB5",
          "#04A5E5",
          "#1E66F5",
          "#7287FD",
          "#C6A0F6",
          "#8839EF",
          "#EA76CB",
        ];
      case "frappe":
        return [
          "#E78284",
          "#EA999C",
          "#EEBEBE",
          "#F2D5CF",
          "#EF9F76",
          "#E5C890",
          "#A6D189",
          "#81C8BE",
          "#70B7B0",
          "#85C1DC",
          "#99D1DB",
          "#8CAAEE",
          "#BABBF1",
          "#CA9EE6",
          "#F4B8E4",
          "#D3869B",
        ];
      case "macchiato":
        return [
          "#ED8796",
          "#EE99A0",
          "#F0C6C6",
          "#F4DBD6",
          "#F5A97F",
          "#EED49F",
          "#A6DA95",
          "#8BD5CA",
          "#72B8B0",
          "#7DC4E4",
          "#91D7E3",
          "#8AADF4",
          "#B7BDF8",
          "#C6A0F6",
          "#F5BDE6",
          "#D67B9A",
        ];
      case "mocha":
      default:
        return [
          "#F38BA8",
          "#EBA0AC",
          "#F2CDCD",
          "#F5E0DC",
          "#FAB387",
          "#F9E2AF",
          "#A6E3A1",
          "#94E2D5",
          "#72B8B0",
          "#74C7EC",
          "#89DCEB",
          "#89B4FA",
          "#B4BEFE",
          "#CBA6F7",
          "#F5C2E7",
          "#D9789B",
        ];
    }
  };

  return (
    <Column gap="lg">
      <Column>
        <Text class="title" size="small">
          Colors
        </Text>

        <Row justify="stretch">
          <Button
            group="connected-start"
            groupActive={state.theme.catppuccinFlavor === "latte"}
            onPress={() => {
              state.theme.setCatppuccinFlavor("latte");
              state.theme.setMode("light");
            }}
          >
            <Trans>Latte</Trans>
          </Button>
          <Button
            group="connected"
            groupActive={state.theme.catppuccinFlavor === "frappe"}
            onPress={() => {
              state.theme.setCatppuccinFlavor("frappe");
              state.theme.setMode("dark");
            }}
          >
            <Trans>Frappe</Trans>
          </Button>
          <Button
            group="connected"
            groupActive={state.theme.catppuccinFlavor === "macchiato"}
            onPress={() => {
              state.theme.setCatppuccinFlavor("macchiato");
              state.theme.setMode("dark");
            }}
          >
            <Trans>Macchiato</Trans>
          </Button>
          <Button
            group="connected-end"
            groupActive={state.theme.catppuccinFlavor === "mocha"}
            onPress={() => {
              state.theme.setCatppuccinFlavor("mocha");
              state.theme.setMode("dark");
            }}
          >
            <Trans>Mocha</Trans>
          </Button>
        </Row>

        {/* <Row justify="stretch">
          <Button
            group="connected-start"
            groupActive={state.theme.preset === "stoat"}
            onPress={() => state.theme.setPreset("stoat")}
          >
            <Trans>Stoat</Trans>
          </Button>
          <Button
            group="connected-end"
            groupActive={state.theme.preset === "you"}
            onPress={() => state.theme.setPreset("you")}
          >
            <Trans>Material You</Trans>
          </Button>
        </Row> */}

        <Show when={state.theme.preset === "you"}>
          <AccentPickerRow>
            <AccentSwatch
              type="button"
              style={{
                "background-color":
                  state.theme.m3Accent ?? "var(--md-sys-color-primary)",
              }}
              onClick={() => pickerRef()?.click()}
              aria-label={t`Choose a custom accent colour`}
              aria-pressed={
                !catppuccinPalette().includes(state.theme.m3Accent ?? "")
              }
              selected={
                !catppuccinPalette().includes(state.theme.m3Accent ?? "")
              }
            >
              <MDPalette />
            </AccentSwatch>
            <Text size="small">
              <Trans>Custom accent</Trans>
            </Text>
          </AccentPickerRow>
          <AccentPalette>
            <input
              ref={setPickerRef}
              type="color"
              value={state.theme.m3Accent ?? "#ffffff"}
              onInput={(e) => {
                const colour = (e.currentTarget as HTMLInputElement).value;
                state.theme.setM3Accent(colour);
              }}
              style={{
                position: "absolute",
                opacity: 0,
                width: "0px",
                height: "0px",
                padding: 0,
                border: "none",
              }}
            />
            <For each={catppuccinPalette()}>
              {(colour) => (
                <AccentSwatch
                  type="button"
                  style={{ "background-color": colour }}
                  onClick={() => state.theme.setM3Accent(colour)}
                  aria-label={colour}
                  aria-pressed={state.theme.m3Accent === colour}
                  selected={state.theme.m3Accent === colour}
                />
              )}
            </For>
          </AccentPalette>
        </Show>
      </Column>

      <Column>
        <Text class="title" size="small">
          <Trans>Display & Text</Trans>
        </Text>

        <Checkbox checked={state.theme.blur} onChange={state.theme.toggleBlur}>
          <Trans>
            Enable transparency glass/blur effects (slow on older machines)
          </Trans>
        </Checkbox>

        <Preview>
          <MessagePreview>
            <MessageContainer
              avatar={
                <Avatar
                  size={36}
                  src={user()?.animatedAvatarURL}
                  fallback={user()?.displayName}
                />
              }
              timestamp={new Date()}
              username={user()?.displayName}
              pronouns={user()?.pronouns}
              isLink="hide"
            >
              hello my name is you
            </MessageContainer>
            <MessageContainer
              avatar={<Avatar size={36} fallback={"M"} />}
              timestamp={new Date()}
              username={"MysticPixie"}
              isLink="hide"
            >
              <code class={css({ fontFamily: `var(--fonts-monospace)` })}>
                bregna is the best
              </code>
            </MessageContainer>
          </MessagePreview>
        </Preview>

        <Text class="label">
          <Trans>Message Size</Trans>
        </Text>
        <Slider
          min={12}
          max={24}
          value={state.theme.messageSize}
          onInput={(event) =>
            (state.theme.messageSize = event.currentTarget.value)
          }
        />
      </Column>

      <Text class="label">
        <Trans>Message Group Spacing</Trans>
      </Text>
      <Slider
        min={0}
        max={16}
        value={state.theme.messageGroupSpacing}
        onInput={(event) =>
          (state.theme.messageGroupSpacing = event.currentTarget.value)
        }
      />

      <FloatingSelect
        label={t`Interface Font`}
        value={state.theme.interfaceFont}
        onChange={(e) =>
          state.theme.setInterfaceFont(e.currentTarget.value as Fonts)
        }
        onOpened={loadFonts}
      >
        <For each={FONT_KEYS}>
          {(key) => (
            <MenuItem value={key} style={{ "font-family": key }}>
              {key}
            </MenuItem>
          )}
        </For>
      </FloatingSelect>

      <FloatingSelect
        label={t`Monospace Font`}
        value={state.theme.monospaceFont}
        onChange={(e) =>
          state.theme.setMonospaceFont(e.currentTarget.value as MonospaceFonts)
        }
        onOpened={loadMonoFonts}
      >
        <For each={MONOSPACE_FONT_KEYS}>
          {(key) => (
            <MenuItem value={key} style={{ "font-family": key }}>
              {key}
            </MenuItem>
          )}
        </For>
      </FloatingSelect>

      <Column>
        <Text class="title" size="small">
          <Trans>Chat Input</Trans>
        </Text>

        <Checkbox
          checked={state.settings.getValue("appearance:show_send_button")}
          onChange={(event) =>
            state.settings.setValue(
              "appearance:show_send_button",
              event.currentTarget.checked,
            )
          }
        >
          <Trans>Show send message button</Trans>
        </Checkbox>

        <FloatingSelect
          label={t`Emoji Pack (affects your messages only)`}
          value={state.settings.getValue("appearance:unicode_emoji")}
          onChange={(e) =>
            state.settings.setValue(
              "appearance:unicode_emoji",
              e.currentTarget.value as never,
            )
          }
        >
          <For each={UNICODE_EMOJI_PACKS}>
            {(pack) => <EmojiPack pack={pack} />}
          </For>
        </FloatingSelect>
      </Column>
    </Column>
  );
}

/**
 * Render an individual emoji pack
 * @param pack Pack
 */
function EmojiPack(props: { pack: UnicodeEmojiPacks }) {
  return (
    <MenuItem value={props.pack}>
      <Row>
        <UnicodeEmoji emoji="😃" pack={props.pack} />
        <UnicodeEmoji emoji="😂" pack={props.pack} />
        <UnicodeEmoji emoji="😶‍🌫️" pack={props.pack} />
        <UnicodeEmoji emoji="🤨" pack={props.pack} />
        <UnicodeEmoji emoji="🤔" pack={props.pack} />
        <Switch>
          <Match when={props.pack === "fluent-3d"}>Fluent 3D</Match>
          <Match when={props.pack === "fluent-color"}>Fluent Color</Match>
          <Match when={props.pack === "fluent-flat"}>Fluent Flat</Match>
          <Match when={props.pack === "mutant"}>Mutant Remix</Match>
          <Match when={props.pack === "noto"}>Noto</Match>
          {/* <Match when={props.pack === "openmoji"}>OpenMoji</Match> */}
          <Match when={props.pack === "twemoji"}>Twemoji</Match>
        </Switch>
      </Row>
    </MenuItem>
  );
}

const Preview = styled("div", {
  base: {
    height: "126px",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-lg)",
    background: "var(--md-sys-color-surface-container-lowest)",
  },
});

const MessagePreview = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--gap-md)",
    gap: "var(--message-group-spacing)",
  },
});

const AccentPalette = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 64px)",
    gap: "var(--gap-md)",
    width: "100%",
    maxWidth: "620px",
    justifyContent: "start",

    "@media (max-width: 520px)": {
      gridTemplateColumns: "repeat(4, 64px)",
    },
  },
});

const AccentPickerRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-md)",
    minHeight: "64px",
  },
});

const AccentSwatch = styled("button", {
  base: {
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "2px solid transparent",
    borderRadius: "50%",
    color: "var(--md-sys-color-on-primary)",
    fill: "currentColor",
    cursor: "pointer",
    transition:
      "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",

    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px #0003",
    },

    _active: {
      transform: "scale(0.95)",
    },

    _focusVisible: {
      outline: "2px solid var(--md-sys-color-on-surface)",
      outlineOffset: "3px",
    },
  },
  variants: {
    selected: {
      true: {
        borderColor: "var(--md-sys-color-on-surface)",
        boxShadow: "0 0 0 3px var(--md-sys-color-surface-container)",
      },
    },
  },
});
