import { useParams } from "react-router-dom";
import { useGitHubData } from "../hooks/useGitHubData";
import ProfileHeader from "../components/ProfileHeader";

export default function Dashboard() {
  const { username } = useParams();
  const { status, error, data } = useGitHubData(username);

  if (status === "loading") return <p style={{ color: "white" }}>Loading...</p>;
  if (status === "error") return <p style={{ color: "white" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <ProfileHeader user={data.user} />
    </div>
  );
}