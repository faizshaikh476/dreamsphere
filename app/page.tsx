import { AuthGate } from "@/components/auth/auth-gate";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { FeedList } from "@/components/dreams/feed-list";

export default function HomePage() {
  return (
    <AuthGate>
      <DashboardHero />
      <section className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Community feed</p>
          <h2 className="text-xl font-semibold">Public dreams from the network</h2>
        </div>
      </section>
      <FeedList />
    </AuthGate>
  );
}
