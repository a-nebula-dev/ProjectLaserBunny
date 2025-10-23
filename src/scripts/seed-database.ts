import mongoose from "mongoose";
import Product from "@/lib/models/product";
import Category from "@/lib/models/category";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const categories = [
  {
    name: "Novidades",
    slug: "novidades",
    description: "Produtos recém-chegados e lançamentos exclusivos",
  },
  {
    name: "Decoração",
    slug: "decoracao",
    description: "Itens decorativos para transformar seu ambiente",
  },
  {
    name: "Presentes",
    slug: "presentes",
    description: "Presentes únicos para ocasiões especiais",
  },
  {
    name: "Personalizados",
    slug: "personalizados",
    description: "Produtos personalizados com gravação a laser",
  },
  {
    name: "Promoções",
    slug: "promocoes",
    description: "Ofertas especiais e produtos em promoção",
  },
];

const products = [
  {
    name: "Produto Artesanal 1",
    price: 89.9,
    image: "/handmade-craft-product.jpg",
    category: "Novidades",
    description:
      "Produto artesanal feito à mão com materiais de alta qualidade. Cada peça é única e cuidadosamente elaborada por artesãos experientes. Perfeito para quem busca exclusividade e qualidade.",
    stock: 15,
    details: [
      "Material: Madeira de reflorestamento",
      "Dimensões: 20cm x 15cm x 5cm",
      "Peso: 300g",
      "Acabamento: Verniz natural",
    ],
  },
  {
    name: "Decoração Especial",
    price: 129.9,
    image: "/home-decoration-item.jpg",
    category: "Decoração",
    description:
      "Peça decorativa única para transformar seu ambiente. Design exclusivo que combina modernidade e tradição artesanal.",
    stock: 8,
    details: [
      "Material: MDF de alta qualidade",
      "Dimensões: 30cm x 25cm",
      "Peso: 500g",
      "Cores disponíveis: Natural, Branco, Preto",
    ],
  },
  {
    name: "Presente Único",
    price: 159.9,
    image: "/unique-gift-box.jpg",
    category: "Presentes",
    description:
      "O presente perfeito para ocasiões especiais. Embalagem premium incluída.",
    stock: 12,
    details: [
      "Material: Madeira nobre",
      "Dimensões: 25cm x 20cm x 10cm",
      "Peso: 450g",
      "Inclui embalagem de presente",
    ],
  },
  {
    name: "Item Personalizado",
    price: 199.9,
    image: "/personalized-item.jpg",
    category: "Personalizados",
    description:
      "Personalize do seu jeito com gravação a laser de alta precisão.",
    stock: 20,
    details: [
      "Material: Madeira ou acrílico",
      "Dimensões: Personalizável",
      "Gravação a laser incluída",
      "Prazo de produção: 5-7 dias",
    ],
  },
  {
    name: "Oferta Especial",
    price: 79.9,
    image: "/special-offer-product.jpg",
    category: "Promoções",
    description: "Aproveite esta oferta por tempo limitado. Estoque reduzido!",
    stock: 5,
    details: [
      "Material: MDF",
      "Dimensões: 15cm x 15cm",
      "Peso: 200g",
      "Promoção válida até o fim do estoque",
    ],
  },
  {
    name: "Artesanato Premium",
    price: 249.9,
    image: "/premium-handcraft.jpg",
    category: "Novidades",
    description:
      "Artesanato premium com acabamento impecável e design sofisticado.",
    stock: 6,
    details: [
      "Material: Madeira maciça",
      "Dimensões: 35cm x 30cm x 8cm",
      "Peso: 800g",
      "Acabamento: Laca premium",
    ],
  },
  {
    name: "Decoração Moderna",
    price: 169.9,
    image: "/modern-decor.jpg",
    category: "Decoração",
    description:
      "Design moderno para ambientes contemporâneos. Minimalista e elegante.",
    stock: 10,
    details: [
      "Material: MDF e metal",
      "Dimensões: 40cm x 30cm",
      "Peso: 600g",
      "Estilo: Minimalista",
    ],
  },
  {
    name: "Kit Presente",
    price: 299.9,
    image: "/gift-set-bundle.jpg",
    category: "Presentes",
    description:
      "Kit completo com vários itens especiais. Perfeito para presentear.",
    stock: 7,
    details: [
      "Contém: 3 itens coordenados",
      "Embalagem premium",
      "Cartão personalizado incluído",
      "Ideal para datas especiais",
    ],
  },
  {
    name: "Chaveiro Personalizado",
    price: 39.9,
    image: "/custom-keychain.jpg",
    category: "Personalizados",
    description: "Chaveiro com gravação personalizada. Ótima lembrancinha!",
    stock: 50,
    details: [
      "Material: Madeira ou acrílico",
      "Dimensões: 5cm x 3cm",
      "Peso: 20g",
      "Gravação incluída",
    ],
  },
  {
    name: "Quadro Decorativo",
    price: 189.9,
    image: "/decorative-frame.jpg",
    category: "Decoração",
    description: "Quadro decorativo com arte exclusiva. Pronto para pendurar.",
    stock: 9,
    details: [
      "Material: MDF com impressão UV",
      "Dimensões: 50cm x 40cm",
      "Peso: 700g",
      "Inclui suporte para parede",
    ],
  },
  {
    name: "Caixa Organizadora",
    price: 99.9,
    image: "/organizer-box.jpg",
    category: "Novidades",
    description: "Organize seus itens com estilo. Compartimentos internos.",
    stock: 18,
    details: [
      "Material: MDF",
      "Dimensões: 25cm x 20cm x 15cm",
      "Peso: 400g",
      "Compartimentos: 4 divisórias",
    ],
  },
  {
    name: "Porta-retratos",
    price: 69.9,
    image: "/ornate-gold-frame.png",
    category: "Presentes",
    description: "Porta-retratos elegante para suas memórias especiais.",
    stock: 25,
    details: [
      "Material: Madeira",
      "Dimensões: 20cm x 15cm",
      "Peso: 250g",
      "Suporta foto 10x15cm",
    ],
  },
];

async function seedDatabase() {
  try {
    console.log("[v0] Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("[v0] Connected to MongoDB");

    // Clear existing data
    console.log("[v0] Clearing existing data...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("[v0] Existing data cleared");

    // Seed categories
    console.log("[v0] Seeding categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`[v0] ${createdCategories.length} categories created`);

    // Seed products
    console.log("[v0] Seeding products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`[v0] ${createdProducts.length} products created`);

    console.log("[v0] Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[v0] Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
