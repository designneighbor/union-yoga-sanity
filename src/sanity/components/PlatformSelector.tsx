"use client";

import { Stack, Select, Text } from "@sanity/ui";

interface PlatformSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <Stack space={3}>
      <Text size={1} weight="semibold">
        Email Platform
      </Text>
      <Select
        value={value || "resend"}
        onChange={(event) => onChange?.(event.currentTarget.value)}
      >
        <option value="resend">Resend</option>
        <option value="mailchimp" disabled>
          Mailchimp (Coming Soon)
        </option>
        <option value="kit" disabled>
          Kit (Coming Soon)
        </option>
      </Select>
    </Stack>
  );
}

