"use client";
import ImageKitUpload from "../components/imageKitUpload/ImageKitUpload";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Teste de Upload com ImageKit</h1>
      <ImageKitUpload />
    </main>
  );
}
