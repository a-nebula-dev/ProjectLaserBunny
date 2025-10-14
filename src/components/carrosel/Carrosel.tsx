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
export default function Carrosel() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-6">Teste de Upload com ImageKit</h1> */}
      {/* <ImageKitUpload /> */}

      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/NebulaDev"></ImageKitProvider>
      <Carousel
        className="w-full max-w-2xl p-3"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="flex justify-center">
              <Image
                urlEndpoint="https://ik.imagekit.io/NebulaDev"
                src="/imagem-teste-2_7TgAPzJx3.jpg"
                alt="Studio a laser coelho"
                width={120}
                height={120}
                priority
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="flex justify-center">
              <div className="w-[120px] h-[120px] flex items-center justify-center rounded-lg shadow-lg bg-white">
                teste 2AAAAAAAAAAAAAAAAAAAA
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="flex justify-center">
              <div className="w-[120px] h-[120px] flex items-center justify-center rounded-lg shadow-lg bg-white">
                teste 3AAAAAAAAAAAAAAA
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hover:cursor-pointer" />
        <CarouselNext className="hover:cursor-pointer" />
      </Carousel>
    </main>
  );
}
