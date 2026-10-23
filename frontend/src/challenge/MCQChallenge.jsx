import React, { useState } from "react";
import { useApi } from "../utils/api";

export function MCQChallenge({ challenge, onAnswerSubmitted }) {
  const [selectedOption, setSelectedOption] = useState(
    challenge?.selected_option ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const makeRequest = useApi();

  const handleSelectOption = async (index) => {
    if (selectedOption !== null || isSubmitting) return;

    setSelectedOption(index);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await makeRequest(`challenges/${challenge.id}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_option: index }),
      });

      if (onAnswerSubmitted) {
        onAnswerSubmitted();
      }
    } catch (err) {
      console.error("Failed to record answer:", err);
      setSubmitError("Failed to save your answer to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionStyle = (index) => {
    const baseStyle = {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "14px 18px",
      margin: "10px 0",
      borderRadius: "6px",
      border: "1px solid #334155",
      backgroundColor: "#0f172a",
      color: "#f8fafc",
      cursor: selectedOption === null ? "pointer" : "default",
      fontSize: "15px",
      lineHeight: "1.4",
      transition: "border-color 0.2s, background-color 0.2s",
    };

    if (selectedOption === null) {
      return baseStyle;
    }

    if (index === challenge.correct_answer_id) {
      return {
        ...baseStyle,
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        borderColor: "#22c55e",
        color: "#4ade80",
        fontWeight: "600",
      };
    }

    if (index === selectedOption && index !== challenge.correct_answer_id) {
      return {
        ...baseStyle,
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderColor: "#ef4444",
        color: "#f87171",
        fontWeight: "600",
      };
    }

    return {
      ...baseStyle,
      opacity: 0.35,
    };
  };

  return (
    <div
      style={{
        border: "1px solid #334155",
        borderRadius: "8px",
        padding: "24px",
        backgroundColor: "#1e293b",
        color: "#f8fafc",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <span
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            fontWeight: "700",
            letterSpacing: "0.5px",
            color: "#94a3b8",
          }}
        >
          Difficulty: {challenge.difficulty}
        </span>
      </div>

      <h3
        style={{
          margin: "0 0 18px 0",
          fontSize: "18px",
          lineHeight: "1.5",
          color: "#f8fafc",
        }}
      >
        {challenge.title}
      </h3>

      <div>
        {challenge.options.map((option, index) => (
          <button
            key={index}
            style={getOptionStyle(index)}
            onClick={() => handleSelectOption(index)}
            disabled={selectedOption !== null || isSubmitting}
          >
            <strong style={{ marginRight: "6px" }}>
              {String.fromCharCode(65 + index)}.
            </strong>{" "}
            {option}
          </button>
        ))}
      </div>

      {submitError && (
        <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "10px" }}>
          {submitError}
        </p>
      )}

      {selectedOption !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "6px",
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
          }}
        >
          <h4
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              color: "#38bdf8",
            }}
          >
            Explanation:
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#cbd5e1",
              lineHeight: "1.6",
            }}
          >
            {challenge.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default MCQChallenge;