import { notFound } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ProductDetails from '@/app/components/ProductDetails/ProductDetails';
import { Product } from '@/app/types';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://web-backend-sck9.onrender.com/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8 mt-8">
        <ProductDetails product={product} />
      </main>

      <Footer />
    </div>
  );
}
