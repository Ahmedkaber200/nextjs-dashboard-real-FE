import { StateCreator, create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
const prefix = 'chan-';

export const zustandMiddleware = <T>(
  handler: StateCreator<T>,
  name: string
) => {
  return create(
    devtools(
      persist(handler, {
        name: prefix.concat(name),
        storage: createJSONStorage(() => localStorage),
      })
    )
  );
};