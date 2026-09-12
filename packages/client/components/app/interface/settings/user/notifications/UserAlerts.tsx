import { For, Show, createMemo, createSignal } from "solid-js";

import { Trans } from "@lingui/solid/macro";

import { useClient } from "@revolt/client";
import { useState } from "@revolt/state";
import { Avatar, Button, Column, Row, Text, TextField } from "@revolt/ui";

/**
 * Configure users whose messages should always trigger a priority alert.
 */
export default function UserAlerts() {
  const state = useState();
  const client = useClient();
  const [query, setQuery] = createSignal("");

  const watchedUsers = () =>
    state.settings.getValue("notifications:watched_users") ?? [];

  const suggestions = createMemo(() => {
    const value = query().trim().toLowerCase();
    if (!value) return [];

    return client()
      .users.toList()
      .filter(
        (user) =>
          !watchedUsers().includes(user.id) &&
          (user.username.toLowerCase().includes(value) ||
            user.id.toLowerCase() === value),
      )
      .slice(0, 5);
  });

  function addUser(userId = query().trim()) {
    const normalizedUser = client()
      .users.toList()
      .find(
        (user) =>
          user.id.toLowerCase() === userId.toLowerCase() ||
          user.username.toLowerCase() === userId.toLowerCase(),
      );
    const resolvedUserId = normalizedUser?.id ?? userId;

    if (!resolvedUserId || watchedUsers().includes(resolvedUserId)) return;

    state.settings.setValue("notifications:watched_users", [
      ...watchedUsers(),
      resolvedUserId,
    ]);
    setQuery("");
  }

  function removeUser(userId: string) {
    state.settings.setValue(
      "notifications:watched_users",
      watchedUsers().filter((id) => id !== userId),
    );
  }

  return (
    <Column gap="xl">
      <Column>
        <Text class="title">
          <Trans>Puppygirl Alarm</Trans>
        </Text>
        <Text>
          <Trans>
            Messages from these users always play a priority sound, even when
            the channel is muted or you are viewing it.
          </Trans>
        </Text>
      </Column>

      <Column gap="s">
        <Row align>
          <TextField
            variant="outlined"
            label="Username or user ID"
            value={query()}
            onInput={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addUser();
            }}
          />
          <Button onPress={() => addUser()}>
            <Trans>Add User</Trans>
          </Button>
        </Row>
        <Show when={suggestions().length}>
          <Column gap="none">
            <For each={suggestions()}>
              {(user) => (
                <Button variant="text" onPress={() => addUser(user.id)}>
                  <Row align>
                    <Avatar
                      src={user.avatar?.previewUrl}
                      fallback={user.username}
                      size={28}
                    />
                    <Text>{user.username}</Text>
                  </Row>
                </Button>
              )}
            </For>
          </Column>
        </Show>
      </Column>

      <Show when={watchedUsers().length}>
        <Column gap="s">
          <For each={watchedUsers()}>
            {(userId) => {
              const user = client().users.get(userId);
              return (
                <Row
                  align
                  style={{
                    "justify-content": "space-between",
                    padding: "var(--gap-md)",
                    "border-radius": "var(--borderRadius-lg)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                  }}
                >
                  <Row align>
                    <Show when={user}>
                      <Avatar
                        src={user?.avatar?.previewUrl}
                        fallback={user?.username}
                        size={28}
                      />
                    </Show>
                    <Text>{user?.username ?? userId}</Text>
                  </Row>
                  <Button variant="text" onPress={() => removeUser(userId)}>
                    <Trans>Remove</Trans>
                  </Button>
                </Row>
              );
            }}
          </For>
        </Column>
      </Show>
    </Column>
  );
}
