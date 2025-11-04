import Header from "./components/Header/Header";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import ProductList from "./components/ProductList/ProductList";
import Footer from "./components/Footer/Footer";
import { Product } from "./types";

// Dados de exemplo para seus produtos
// Em um projeto real, isso viria de um banco de dados
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Pro",
    price: 1299.90,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "Notebook Gamer",
    price: 4599.00,
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "Fone de Ouvido Bluetooth",
    price: 349.50,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    name: "Câmera DSLR",
    price: 2199.99,
    imageUrl: "https://images.unsplash.com/photo-1510127034890-ba27e982b6c1?w=500&auto=format&fit=crop&q=60",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-12">
          <HeroBanner />
          <ProductList products={featuredProducts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}