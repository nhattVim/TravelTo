import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { destinationsList } from "@/lib/data/destinations";

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return destinationsList.map((destination) => ({
    slug: destination.slug,
  }));
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const destination = destinationsList.find((d) => d.slug === resolvedParams.slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Full-width Hero Banner */}
        <div className="relative h-[60vh] w-full md:h-[75vh]">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Banner Content Container */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="mx-auto max-w-5xl px-5 pb-12 md:px-8 md:pb-16">
              <div className="mb-4 inline-flex items-center gap-2 text-[#66d9a8]">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-[0.2em]">{destination.name}</span>
              </div>

              <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl lg:text-8xl">
                {destination.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Magazine Style Content */}
        <article className="mx-auto mt-10 max-w-5xl px-5 md:mt-16 md:px-8">

          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#0a7d59]"
          >
            <ArrowLeft className="h-4 w-4" />
            Trở về trang chủ
          </Link>

          <div className="prose prose-lg prose-[#0a7d59] max-w-none md:prose-xl prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-800 prose-p:leading-relaxed prose-li:text-gray-800 prose-img:rounded-xl prose-img:shadow-lg prose-p:first-of-type:first-letter:float-left prose-p:first-of-type:first-letter:mr-3 prose-p:first-of-type:first-letter:text-7xl prose-p:first-of-type:first-letter:font-bold prose-p:first-of-type:first-letter:text-[#0a7d59]">
            <ReactMarkdown>
              {destination.markdownContent}
            </ReactMarkdown>
          </div>

          {/* Compact CTA Box */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#cdece0] bg-linear-to-r from-[#effff7] to-white px-6 py-8 shadow-sm md:flex-row md:px-10">
            <div>
              <h2 className="text-2xl font-bold text-[#083b2d]">Bạn muốn khám phá {destination.name}?</h2>
              <p className="mt-2 text-base text-gray-600">
                Tìm kiếm ngay các tour du lịch trọn gói tuyệt vời nhất từ TravelTo.
              </p>
            </div>
            <Link
              href={`/tours?destination=${destination.province}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a7d59] px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-[#085a41] shadow-lg shadow-[#0a7d59]/20"
            >
              Xem tour ngay
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
