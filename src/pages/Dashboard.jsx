import { useParams } from "react-router-dom";
import { useGitHubData } from "../hooks/useGitHubData";

export default function Dashboard() {
  const { username } = useParams();
  const { status, error, data } = useGitHubData(username);

  if (status === "loading") return <p style={{ color: "white" }}>Loading...</p>;
  if (status === "error") return <p style={{ color: "white" }}>Error: {error}</p>;

  return (
    <pre style={{ color: "white" }}>
      {data.user.name} has {data.repos.length} repos and {data.events.length} recent events
    </pre>
  );
}