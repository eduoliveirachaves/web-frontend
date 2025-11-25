import { notFound } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ProductDetails from '@/app/components/ProductDetails/ProductDetails';
import ReviewsSection from '@/app/components/ReviewsSection/ReviewsSection';
import { productService } from '@/app/services/productService';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await productService.getProductById(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8 mt-8">
        <ProductDetails product={product} />
        <div className="mt-12">
          <ReviewsSection productId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
