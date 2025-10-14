"use client";
import React from "react";
import { Image, ImageKitProvider } from "@imagekit/next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import ImageKitUpload from "../components/imageKitUpload/ImageKitUpload";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-6">Teste de Upload com ImageKit</h1> */}
      {/* <ImageKitUpload /> */}

      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/NebulaDev"></ImageKitProvider>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <Image
              urlEndpoint="https://ik.imagekit.io/NebulaDev"
              src="/imagem-teste-2_7TgAPzJx3.jpg"
              alt="Studio a laser coelho"
              width={120}
              height={120}
              priority
            />
          </CarouselItem>
          <CarouselItem>teste 2AAAAAAAAAAAAAAAAAAAA</CarouselItem>
          <CarouselItem>teste 3AAAAAAAAAAAAAAA</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
