import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/lib/data/destinations";
import { ArrowRight } from "lucide-react";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block h-95 w-full overflow-hidden rounded-2xl md:h-100"
    >
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40"></div>

      <Image
        src={destination.imageUrl}
        alt={destination.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col justify-end p-6 md:p-8">
        <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          {destination.name}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-200 transition-all duration-300 md:text-base">
          {destination.shortDescription}
        </p>

        <div className="mt-4 flex max-h-0 items-center gap-2 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-12.5 group-hover:opacity-100">
          <span className="text-sm font-semibold text-[#66d9a8]">Khám phá ngay</span>
          <ArrowRight className="h-4 w-4 text-[#66d9a8]" />
        </div>
      </div>
    </Link>
  );
}
