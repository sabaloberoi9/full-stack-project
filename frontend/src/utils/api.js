import { useAuth } from "@clerk/clerk-react";

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = async (endpoint, options = {}) => {
    const token = await getToken();

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 429) {
        throw new Error("Daily quota exceeded");
      }
      throw new Error(errorData?.detail || "An error occurred");
    }

    return response.json();
  };

  return makeRequest;
};

// Aliases so both casings work regardless of how it's imported
export const useAPI = useApi;
export default useApi;