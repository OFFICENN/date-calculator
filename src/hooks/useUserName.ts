const ENV_OWNER_NAME = import.meta.env.VITE_OWNER_NAME as string | undefined;

export function useUserName() {
  const userName = ENV_OWNER_NAME ?? "";
  return { userName };
}
