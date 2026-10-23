import React, { useState, useEffect } from "react";
import MCQChallenge from "../challenge/MCQChallenge";
import { useApi } from "../utils/api";

export function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const makeRequest = useApi();

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await makeRequest("my-history");
      setHistory(data.challenges || []);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="retry-button" onClick={fetchHistory}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <h2>History</h2>
      {history.length === 0 ? (
        <p className="no-history">No challenge history</p>
      ) : (
        <div className="history-list">
          {history.map((challenge) => (
            <MCQChallenge
              key={challenge.id}
              challenge={challenge}
              showExplanation={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;