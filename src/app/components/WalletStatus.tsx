'use client'

import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { ConnectKitButton } from "connectkit";

export const WalletStatus = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  if (isConnecting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-lg font-semibold bg-purple-600 rounded-lg px-4 py-2"
      >
        Connecting...
      </motion.div>
    );
  }

  if (isDisconnected) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={show}
          >
            Connect Wallet
          </motion.button>
        )}
      </ConnectKitButton.Custom>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-white text-lg font-semibold bg-green-600 rounded-lg px-4 py-2"
    >
      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
    </motion.div>
  );
};

