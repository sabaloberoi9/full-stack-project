import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import ChallengeGenerator from "./challenge/ChallengeGenerator";
import HistoryPanel from "./history/HistoryPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <h1
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              margin: 0,
              color: "#0f172a",
            }}
          >
            AI Coding Challenge Hub
          </h1>

          <SignedIn>
            <nav style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    activeTab === "generator" ? "#2563eb" : "#f1f5f9",
                  color: activeTab === "generator" ? "#ffffff" : "#475569",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.15s ease",
                }}
              >
                Generator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    activeTab === "history" ? "#2563eb" : "#f1f5f9",
                  color: activeTab === "history" ? "#ffffff" : "#475569",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.15s ease",
                }}
              >
                History Panel
              </button>
            </nav>
          </SignedIn>
        </div>

        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          padding: "2rem 1rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <SignedIn>
          {activeTab === "generator" && <ChallengeGenerator />}
          {activeTab === "history" && <HistoryPanel />}
        </SignedIn>

        <SignedOut>
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              maxWidth: "480px",
              margin: "4rem auto 0",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              Welcome to Challenge Hub
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "1.5rem",
                lineHeight: "1.5",
              }}
            >
              Sign in with your developer account to generate challenges, test
              your skills, and review your past submissions.
            </p>
            <SignInButton mode="modal">
              <button
                type="button"
                style={{
                  padding: "10px 22px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}