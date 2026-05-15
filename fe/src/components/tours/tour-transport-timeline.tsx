import { Plane, BusFront } from "lucide-react";
import { formatDateVi } from "@/lib/format";

interface TourTransportTimelineProps {
  departureLocation: string;
  destinationLocation: string;
  transportText?: string;
  departureDate?: string;
  returnDate?: string;
  embedded?: boolean;
}

export function TourTransportTimeline({
  departureLocation,
  destinationLocation,
  transportText,
  departureDate,
  returnDate,
  embedded = false,
}: TourTransportTimelineProps) {
  const isAirplane = transportText?.toLowerCase().includes("máy bay") || transportText?.toLowerCase().includes("bay");
  const Icon = isAirplane ? Plane : BusFront;

  // Format dates e.g., 23/05/2026
  const formatCompactDate = (isoDate?: string) => {
    if (!isoDate) return "Đang cập nhật";
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formattedDeparture = departureDate ? formatCompactDate(departureDate) : "Đang cập nhật";
  const formattedReturn = returnDate ? formatCompactDate(returnDate) : "Đang cập nhật";

  const containerClasses = embedded
    ? ""
    : "rounded-3xl border border-[#cdece0] bg-white p-6 md:p-8";

  return (
    <div className={containerClasses}>
      {!embedded && (
        <h3 className="text-2xl font-bold text-[#0a68a4] text-center mb-10">Phương tiện di chuyển</h3>
      )}
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 relative">
        {/* Divider for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />

        {/* Departure */}
        <div className="relative lg:pr-10">
           <p className="font-bold text-lg mb-6 text-gray-900">
             Ngày đi {departureDate ? `- ${formattedDeparture}` : ""}
           </p>
           
           <div className="flex justify-between font-bold text-lg mb-2">
             <span>07:00</span>
             <span>18:30</span>
           </div>
           
           <div className="relative h-[2px] bg-gray-300 mb-4 flex items-center justify-center">
             <div className="absolute left-0 w-2.5 h-2.5 bg-gray-400 rounded-sm"></div>
             <div className="absolute right-0 w-2.5 h-2.5 bg-gray-400 rounded-sm"></div>
             <div className={`px-2 text-gray-800 z-10 ${embedded ? "bg-[#f8fff9]" : "bg-white"}`}>
               <Icon className="w-6 h-6" />
             </div>
           </div>
           
           <div className="flex justify-between text-base font-medium">
             <span>{departureLocation}</span>
             <span>{destinationLocation}</span>
           </div>
        </div>

        {/* Return */}
        <div className="relative lg:pl-10 mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
           <p className="font-bold text-lg mb-6 text-gray-900">
             Ngày về {returnDate ? `- ${formattedReturn}` : ""}
           </p>
           
           <div className="flex justify-between font-bold text-lg mb-2">
             <span>18:30</span>
             <span>07:00</span>
           </div>
           
           <div className="relative h-[2px] bg-gray-300 mb-4 flex items-center justify-center">
             <div className="absolute left-0 w-2.5 h-2.5 bg-gray-400 rounded-sm"></div>
             <div className="absolute right-0 w-2.5 h-2.5 bg-gray-400 rounded-sm"></div>
             <div className={`px-2 text-gray-800 z-10 ${embedded ? "bg-[#f8fff9]" : "bg-white"}`}>
               <Icon className="w-6 h-6" />
             </div>
           </div>
           
           <div className="flex justify-between text-base font-medium">
             <span>{destinationLocation}</span>
             <span>{departureLocation}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
