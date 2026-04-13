import { getTourDetail } from "@/lib/api/public";
import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "@/components/tours/checkout-form";
import { auth } from "@/auth";

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ departureId?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const { id } = await params;
  const { departureId } = await searchParams;

  const numericTourId = Number(id);
  const numericDepartureId = Number(departureId);

  if (Number.isNaN(numericTourId) || Number.isNaN(numericDepartureId)) {
    notFound();
  }

  const tour = await getTourDetail(numericTourId).catch(() => null);
  if (!tour) {
    notFound();
  }

  const departure = (tour.departures || []).find((d) => d.id === numericDepartureId);
  if (!departure) {
    notFound();
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Thanh toán</p>
        <h1 className="mt-2 text-3xl font-bold text-[#083b2d] md:text-5xl">Đặt chỗ cho chuyến đi</h1>
      </div>

      <CheckoutForm 
        tourId={tour.id}
        departureId={departure.id}
        pricePerGuest={departure.price}
        slotsAvailable={departure.slotsAvailable}
        departureDate={departure.departureDate}
        tourTitle={tour.title}
        token={session.backendAccessToken}
        initialName={session.user?.name || ""}
        initialPhone={""}
      />
    </div>
  );
}
