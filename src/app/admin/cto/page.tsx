import AppNav from "@/components/AppNav";
import CTODashboard from "@/components/CTODashboard";

export default function CTOPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav />
      <CTODashboard />
    </div>
  );
}
