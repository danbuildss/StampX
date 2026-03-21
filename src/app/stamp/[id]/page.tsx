import AppNav from "@/components/AppNav";
import StampDetailPage from "@/components/StampDetailPage";

export default function StampPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav />
      <StampDetailPage id={params.id} />
    </div>
  );
}
