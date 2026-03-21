import CreateStampForm from "@/components/CreateStampForm";
import AppNav from "@/components/AppNav";

export default function CreatePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav />
      <CreateStampForm />
    </div>
  );
}
