import { useParams } from "react-router-dom";
import { useGitHubData } from "../hooks/useGitHubData";
import { buildHeatmapData } from "../utils/dataHelpers";
import ProfileHeader from "../components/ProfileHeader";
import ContributionHeatmap from "../components/ContributionHeatmap";

export default function Dashboard() {
  const { username } = useParams();
  const { status, error, data } = useGitHubData(username);

  if (status === "loading") return <p style={{ color: "white" }}>Loading...</p>;
  if (status === "error") return <p style={{ color: "white" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <ProfileHeader user={data.user} />
      <ContributionHeatmap data={buildHeatmapData(data.events)} />
    </div>
  );
}