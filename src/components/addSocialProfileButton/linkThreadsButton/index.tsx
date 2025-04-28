import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function LinkThreadsButton({ teamId }: { teamId: string }) {
  const router = useRouter();

  const generateAuthLink = api.oauth2.generateThreadsOAuth2URL.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  async function handleClick() {
    const { data } = await generateAuthLink.refetch();
    document.cookie = `teamId=${teamId}`;
    if (data?.url) {
      router.push(data.url);
    }
  }

  if (!teamId) {
    return null;
  }

  return (
    <button
      className="flex select-none flex-col items-center justify-center rounded-lg border-2 border-border p-10 transition-colors duration-200 ease-in-out hover:bg-secondary"
      onClick={handleClick}
      type="button"
    >
      <img
        alt="Youtube logo"
        className="mb-2 h-8 w-8"
        src="/logos/threads_logo.png"
      />
      <p className="font-medium">Threads</p>
    </button>
  );
}
