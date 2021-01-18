import { useEffect } from "react";

export default function useEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options: boolean | AddEventListenerOptions = false
): void {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(type, listener, options);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener(type, listener);
    };
  });
}
