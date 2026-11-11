import { useParams } from "react-router-dom";
import { useGitHubData } from "../hooks/useGitHubData";
import { buildHeatmapData, buildLanguageData, buildInsights } from "../utils/dataHelpers";

export default function Dashboard() {
  const { username } = useParams();
  const { status, error, data } = useGitHubData(username);

  if (status === "loading") return <p style={{ color: "white" }}>Loading...</p>;
  if (status === "error") return <p style={{ color: "white" }}>Error: {error}</p>;

  const heatmap = buildHeatmapData(data.events);
  const languages = buildLanguageData(data.languages);
  const insights = buildInsights(data.user, data.repos, data.events);

  console.log({ heatmap, languages, insights });

  return <p style={{ color: "white" }}>Open the console (F12) and check the output.</p>;
}