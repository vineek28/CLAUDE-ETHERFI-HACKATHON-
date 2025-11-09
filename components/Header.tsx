"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home } from "lucide-react";

export default function Header() {
  const { account, connectWallet, isConnecting } = useWeb3();
  const pathname = usePathname();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <header className="border-b border-gray-800 bg-dark-900 bg-opacity-80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">
              liquid<span className="text-primary-400">.stake</span>
            </h1>
            <p className="text-xs text-gray-500">Educational Demo</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              pathname === "/"
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-dark-700"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              pathname === "/analytics"
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-dark-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <div>
          {account ? (
            <div className="bg-dark-700 px-4 py-2 rounded-lg border border-primary-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {formatAddress(account)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
