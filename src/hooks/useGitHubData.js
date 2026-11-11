import { useState, useEffect } from "react";
import { fetchAllData } from "../api/github";

export function useGitHubData(username) {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError(null);
      setData(null);

      try {
        const result = await fetchAllData(username);
        if (!cancelled) {
          setData(result);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { status, error, data };
}