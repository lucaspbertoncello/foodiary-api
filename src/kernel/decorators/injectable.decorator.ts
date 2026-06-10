import { Registry } from "@kernel/container/registry";
import { Constructor } from "@shared/@types/constructor.type";

export function Injectable(): ClassDecorator {
  return (target) => {
    Registry.getInstance().register(target as unknown as Constructor);
  };
}
