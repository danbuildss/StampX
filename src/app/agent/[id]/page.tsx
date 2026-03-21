import AppNav from "@/components/AppNav";
import AgentProfilePage from "@/components/AgentProfilePage";

export default async function AgentRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <AppNav />
      <AgentProfilePage agentId={id} />
    </>
  );
}
