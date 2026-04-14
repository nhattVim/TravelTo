import { SectionTitle } from "@/components/shared/section-title";
import { DestinationCard } from "./destination-card";
import { destinationsList } from "@/lib/data/destinations";

export function DestinationsSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          eyebrow="Điểm đến ấn tượng"
          title="Cẩm nang du lịch"
          subtitle="Khám phá những vùng đất mới lạ cùng những kinh nghiệm du lịch đáng nhớ."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {destinationsList.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}
