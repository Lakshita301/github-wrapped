import { useParams, Link } from "react-router-dom";
import { useGitHubData } from "../hooks/useGitHubData";
import {
  buildHeatmapData,
  buildLanguageData,
  buildInsights,
} from "../utils/dataHelpers";
import ProfileHeader from "../components/ProfileHeader";
import ContributionHeatmap from "../components/ContributionHeatmap";
import LanguageChart from "../components/LanguageChart";
import InsightsPanel from "../components/InsightsPanel";
import TopRepos from "../components/TopRepos";
import StatusScreen from "../components/StatusScreen";

export default function Dashboard() {
  const { username } = useParams();
  const { status, error, data } = useGitHubData(username);

  if (status === "loading") return <StatusScreen type="loading" />;
  if (status === "error") return <StatusScreen type="error" message={error} />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        to="/"
        style={{
          color: "#8888aa",
          fontFamily: "DM Mono, monospace",
          fontSize: "0.85rem",
          textDecoration: "none",
        }}
      >
        ← Search another profile
      </Link>
      <ProfileHeader user={data.user} />
      <InsightsPanel
        insights={buildInsights(data.user, data.repos, data.events)}
      />
      <ContributionHeatmap data={buildHeatmapData(data.events)} />
      <LanguageChart data={buildLanguageData(data.languages)} />
      <TopRepos repos={data.repos} />
    </div>
  );
}