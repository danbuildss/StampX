import AppNav from "@/components/AppNav";
import FeedPage from "@/components/FeedPage";

export default function Feed() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav />
      <FeedPage />
    </div>
  );
}
