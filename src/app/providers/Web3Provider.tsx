'use client'

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID || '';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`,
      ),
    },
    walletConnectProjectId,
    appName: "Lens Post Scheduler",
    appDescription: "Schedule posts for your Lens profile",
    appUrl: "https://lens-post-scheduler.vercel.app", // Update this with your actual app URL
    appIcon: "https://lens-post-scheduler.vercel.app/icon.png", // Update this with your actual app icon
  }),
);

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

