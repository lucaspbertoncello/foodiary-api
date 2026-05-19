import React from "react";
import { Tailwind } from "react-email";

export function TailwindConfig({ children }: TailwindConfig.Props) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              foodiary: {
                green: "#64A30D",
              },
              gray: {
                600: "#A1A1AA",
              },
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}

export namespace TailwindConfig {
  export type Props = { children: React.ReactNode };
}
