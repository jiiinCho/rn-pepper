import type { EmitterSubscription, NativeEventSubscription } from 'react-native';

export function addEventListener<
  T extends {
    addEventListener: (...args: any) => NativeEventSubscription | EmitterSubscription;
    removeEventListener?: (...args: any) => void;
    remove?: (...args: any) => void;
  },
>(Module: T, ...rest: Parameters<typeof Module.addEventListener>) {
  const [eventName, handler] = rest;

  let removed = false;

  const subscription = Module.addEventListener(eventName, handler) ?? {
    remove: () => {
      if (removed) {
        return;
      }

      Module.removeEventListener?.(eventName, handler);
      Module.remove?.(eventName, handler);
      removed = true;
    },
  };

  return subscription;
}
