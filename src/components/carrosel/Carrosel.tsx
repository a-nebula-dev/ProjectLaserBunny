"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Image, ImageKitProvider } from "@imagekit/next";

const getAuthParams = async () => {
  const res = await fetch("/api/upload-auth");
  if (!res.ok) throw new Error("Falha ao obter autenticação para upload");
  return res.json();
};

export default function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const slides = [
    {
      id: 1,
      title: "Novidades da Temporada",
      description: "Descubra as últimas tendências em decoração",
      src: "banner2.png",
    },
    {
      id: 2,
      title: "Presentes Personalizados",
      description: "Crie momentos únicos com nossos produtos exclusivos",
    },
    {
      id: 3,
      title: "Promoções Especiais",
      description: "Aproveite descontos de até 50% em produtos selecionados",
    },
  ];

  return (
    <div className="w-full bg-(--color-geral)">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                <ImageKitProvider
                  urlEndpoint="https://ik.imagekit.io/NebulaDev/"
                  transformationPosition="path"
                >
                  <Image src={slide.src!} fill alt={slide.title} />
                </ImageKitProvider>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 transition-all duration-300">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 transition-all duration-300">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 sm:left-4 md:left-6 bg-white/80 hover:bg-white text-(--color-primaria) border-none transition-all duration-300" />
        <CarouselNext className="right-2 sm:right-4 md:right-6 bg-white/80 hover:bg-white text-(--color-primaria) border-none transition-all duration-300" />
      </Carousel>
    </div>
  );
}
