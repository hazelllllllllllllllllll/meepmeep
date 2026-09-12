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
  IconButton,
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
  const [pickerRef, setPickerRef] = createSignal<HTMLDivElement>();

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
          "#DC8A78",
          "#DD7878",
          "#EA76CB",
          "#8839EF",
          "#D20F39",
          "#E64553",
          "#FE640B",
          "#DF8E1D",
          "#40A02B",
          "#179299",
          "#04A5E5",
          "#209FB5",
          "#1E66F5",
          "#7287FD",
        ];
      case "frappe":
        return [
          "#F2D5CF",
          "#EEBEBE",
          "#F4B8E4",
          "#CA9EE6",
          "#E78284",
          "#EA999C",
          "#EF9F76",
          "#E5C890",
          "#A6D189",
          "#81C8BE",
          "#99D1DB",
          "#85C1DC",
          "#8CAAEE",
          "#BABBF1",
        ];
      case "macchiato":
        return [
          "#F4DBD6",
          "#F0C6C6",
          "#F5BDE6",
          "#C6A0F6",
          "#ED8796",
          "#EE99A0",
          "#F5A97F",
          "#EED49F",
          "#A6DA95",
          "#8BD5CA",
          "#91D7E3",
          "#7DC4E4",
          "#8AADF4",
          "#B7BDF8",
        ];
      case "mocha":
      default:
        return [
          "#F5E0DC",
          "#F2CDCD",
          "#F5C2E7",
          "#CBA6F7",
          "#F38BA8",
          "#EBA0AC",
          "#FAB387",
          "#F9E2AF",
          "#A6E3A1",
          "#94E2D5",
          "#89DCEB",
          "#74C7EC",
          "#89B4FA",
          "#B4BEFE",
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
          <Row align justify wrap>
            <IconButton
              ref={setPickerRef}
              variant="filled"
              shape="square"
              size="md"
              onPress={() => pickerRef()?.click()}
            >
              <MDPalette />
            </IconButton>
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
                <Button
                  size="md"
                  bg={colour}
                  group="standard"
                  groupActive={state.theme.m3Accent === colour}
                  onPress={() => state.theme.setM3Accent(colour)}
                />
              )}
            </For>
            {/* <div
            class={css({
              borderRadius: "var(--borderRadius-full)",
              width: "48px",
              height: "48px",
              cursor: "pointer",
            })}
          >
            <MdColorize />
          </div> */}
          </Row>

          {/* TODO: Cursed on mobile; may need to be replaced
          with FloatingSelect / similar on small screens */}
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
