'use client'

import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";

export function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={show}
          >
            {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
          </motion.button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

