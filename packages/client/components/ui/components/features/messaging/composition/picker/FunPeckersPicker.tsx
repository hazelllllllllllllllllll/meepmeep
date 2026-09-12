import { Button } from "@revolt/ui/components/design";
import { useState } from "@revolt/state";

// Add new buttons by putting the exact message text on its own line below.
const FUN_PECKERS = [
  "son",
  "w brenna ❤‍🩹",
  "thank you !❤‍🩹",
  "thank you !❤‍🩹 fun peckers",
  "im crine 😭",
  "son i'm brine :01KQTJ2VY2ED7RDRQB0PQ6Z1YS::01KQTJ2VY2ED7RDRQB0PQ6Z1YS:",
  "w abacus 🧮❤‍🩹",
  "w hazel ❤‍🩹",
  "STOP IT VAGINA",
  "5 minutes to boogie  GO GO GOGOG",
] as const;

export function FunPeckersPicker(props: {
  onMessage: (content: string) => void;
}) {
  const state = useState();
  const messages = () => [
    ...FUN_PECKERS,
    ...(state.settings.getValue("appearance:custom_fun_peckers") ?? []),
  ];

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        flex: 1,
        "min-height": 0,
        "overflow-y": "auto",
        gap: "var(--gap-sm)",
        padding: "var(--gap-md)",
      }}
    >
      {messages().map((message) => (
        <Button onPress={() => props.onMessage(message)}>{message}</Button>
      ))}
    </div>
  );
}
