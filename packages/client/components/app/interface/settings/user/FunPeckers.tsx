import { For, Show, createSignal } from "solid-js";

import { useState } from "@revolt/state";
import { Button, Checkbox, Column, Row, Text, TextField } from "@revolt/ui";

export default function FunPeckersSettings() {
  const state = useState();
  const [pecker, setPecker] = createSignal("");

  function addPecker() {
    const value = pecker().trim();
    if (!value) return;

    state.settings.setValue("appearance:custom_fun_peckers", [
      ...(state.settings.getValue("appearance:custom_fun_peckers") ?? []),
      value,
    ]);
    setPecker("");
  }

  function removePecker(index: number) {
    const peckers = [
      ...(state.settings.getValue("appearance:custom_fun_peckers") ?? []),
    ];
    peckers.splice(index, 1);
    state.settings.setValue("appearance:custom_fun_peckers", peckers);
  }

  return (
    <Column gap="xl">
      <Column>
        <Text class="title" size="small">
          Fun Peckers
        </Text>
        <Checkbox
          checked={state.settings.getValue("appearance:fun_peckers")}
          onChange={(event) =>
            state.settings.setValue(
              "appearance:fun_peckers",
              event.currentTarget.checked,
            )
          }
        >
          Son button
        </Checkbox>
        <Checkbox
          checked={state.settings.getValue("appearance:fun_peckers_menu")}
          onChange={(event) =>
            state.settings.setValue(
              "appearance:fun_peckers_menu",
              event.currentTarget.checked,
            )
          }
        >
          Show Fun Peckers popout
        </Checkbox>
      </Column>

      <Column>
        <Text class="title" size="small">
          Custom peckers
        </Text>
        <Row align>
          <TextField
            variant="outlined"
            value={pecker()}
            placeholder="Type a custom pecker"
            onInput={(event) => setPecker(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addPecker();
            }}
          />
          <Button onPress={addPecker}>Add pecker</Button>
        </Row>
        <Show when={state.settings.getValue("appearance:custom_fun_peckers")?.length}>
          <For each={state.settings.getValue("appearance:custom_fun_peckers")}>
            {(item, index) => (
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "space-between",
                  gap: "var(--gap-md)",
                  padding: "var(--gap-md)",
                  "border-radius": "var(--borderRadius-lg)",
                  border: "1px solid var(--md-sys-color-outline-variant)",
                  background: "var(--md-sys-color-surface-container-low)",
                  "box-shadow": "0 2px 6px #0002",
                }}
              >
                <Text>{item}</Text>
                <Button variant="text" onPress={() => removePecker(index())}>
                  Remove
                </Button>
              </div>
            )}
          </For>
        </Show>
      </Column>
    </Column>
  );
}
