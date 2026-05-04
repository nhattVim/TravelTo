import { TourItem } from "@/types/travel";
import { HorizontalTourCard } from "@/components/tours/horizontal-tour-card";

interface RelatedToursProps {
  tours: TourItem[];
  token?: string;
}

export function RelatedTours({ tours, token }: RelatedToursProps) {
  if (!tours || tours.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-3xl font-bold text-[#083b2d]">Có thể bạn cũng thích</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {tours.map((tour) => (
          <HorizontalTourCard key={tour.id} tour={tour} token={token} />
        ))}
      </div>
    </div>
  );
}
