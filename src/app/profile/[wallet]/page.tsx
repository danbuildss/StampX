import AppNav from "@/components/AppNav";
import ProfilePage from "@/components/ProfilePage";

export default function Profile({ params }: { params: { wallet: string } }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav />
      <ProfilePage wallet={params.wallet} />
    </div>
  );
}
