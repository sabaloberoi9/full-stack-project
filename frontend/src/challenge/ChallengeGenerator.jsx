import React, { useState, useEffect } from "react";
import MCQChallenge from "./MCQChallenge";
import { useApi } from "../utils/api";

export function ChallengeGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("Programming");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quota, setQuota] = useState(null);
  const [stats, setStats] = useState({
    total_answered: 0,
    total_correct: 0,
    accuracy: 0.0,
  });

  const makeRequest = useApi();

  const fetchQuota = async () => {
    try {
      const data = await makeRequest("quota");
      setQuota(data.quota_remaining);
    } catch (err) {
      console.error("Failed to fetch quota:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await makeRequest("stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchQuota();
    fetchStats();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await makeRequest("generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, topic }),
      });
      setChallenge(data.challenge);
      setQuota(data.quota_remaining);
    } catch (err) {
      console.error("Failed to generate challenge:", err);
      setError("Failed to generate challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "10px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem", color: "#f8fafc" }}>
        Coding Challenge Generator
      </h2>

      {/* Metrics Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "8px",
          padding: "14px 20px",
          margin: "16px 0",
          fontSize: "14px",
          color: "#f8fafc",
        }}
      >
        <span>
          <strong style={{ color: "#94a3b8" }}>Quota:</strong>{" "}
          {quota !== null ? `${quota} left` : "Loading..."}
        </span>
        <span>
          <strong style={{ color: "#94a3b8" }}>Answered:</strong> {stats.total_answered}
        </span>
        <span>
          <strong style={{ color: "#94a3b8" }}>Correct:</strong> {stats.total_correct}
        </span>
        <span>
          <strong style={{ color: "#94a3b8" }}>Accuracy:</strong> {stats.accuracy}%
        </span>
      </div>

      {/* Selectors */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          margin: "1.5rem 0",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            htmlFor="topic-select"
            style={{ display: "block", marginBottom: "6px", fontWeight: 500, color: "#cbd5e1" }}
          >
            Select Topic:
          </label>
          <select
            id="topic-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              fontSize: "14px",
            }}
          >
            <option value="Programming">Programming</option>
            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
            <option value="LLMs">LLMs</option>
            <option value="Cloud Architecture">Cloud Architecture</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label
            htmlFor="difficulty-select"
            style={{ display: "block", marginBottom: "6px", fontWeight: 500, color: "#cbd5e1" }}
          >
            Select Difficulty:
          </label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              fontSize: "14px",
            }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || quota === 0}
        style={{
          padding: "10px 22px",
          fontSize: "15px",
          fontWeight: 600,
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          cursor: isLoading || quota === 0 ? "not-allowed" : "pointer",
          opacity: isLoading || quota === 0 ? 0.6 : 1,
        }}
      >
        {isLoading ? "Generating..." : "Generate Challenge"}
      </button>

      {error && (
        <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "14px" }}>
          {error}
        </p>
      )}

      {challenge && (
        <div style={{ marginTop: "1.5rem" }}>
          <MCQChallenge
            key={challenge.id}
            challenge={challenge}
            onAnswerSubmitted={fetchStats}
          />
        </div>
      )}
    </div>
  );
}

export default ChallengeGenerator;