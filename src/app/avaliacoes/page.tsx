'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { cartService } from '@/app/services/cartService';
import { ratingService } from '@/app/services/ratingService';
import { Order, Rating } from '@/app/types';
import { Star } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

interface ProductToReview {
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  orderDate: string;
}

export default function AvaliacoesPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsToReview, setProductsToReview] = useState<ProductToReview[]>([]);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'avaliados' | 'nao-avaliados'>('todos');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductToReview | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      loadData();
    }
  }, [user, token]);

  const loadData = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      // Busca pedidos finalizados do usuário
      const userOrders = await cartService.getMyOrders(user.id, token);
      const completedOrders = userOrders.filter(
        (order: Order) => order.status === 'PAID' || order.status === 'DELIVERED'
      );
      setOrders(completedOrders);

      // Extrai produtos dos pedidos
      const products: ProductToReview[] = [];
      completedOrders.forEach((order: Order) => {
        order.items.forEach((item) => {
          products.push({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            orderId: order.id,
            orderDate: order.createdAt || '',
          });
        });
      });
      setProductsToReview(products);

      // Busca avaliações do usuário (simulado - precisaria de endpoint no backend)
      // Por enquanto, vamos buscar as avaliações de cada produto e filtrar pelo userId
      const ratings: Rating[] = [];
      for (const product of products) {
        const productRatings = await ratingService.getRatingsByProduct(product.productId);
        const userRating = productRatings.find((r) => r.userId === user.id);
        if (userRating) {
          ratings.push(userRating);
        }
      }
      setUserRatings(ratings);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRating = (productId: string) => {
    return userRatings.some((r) => r.productId === productId);
  };

  const openModal = (product: ProductToReview) => {
    setSelectedProduct(product);
    setRating(0);
    setComment('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setRating(0);
    setComment('');
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !user || !token || rating === 0) return;

    setSubmitting(true);
    try {
      await ratingService.createRating(
        selectedProduct.productId,
        user.id,
        rating,
        comment,
        token
      );
      showToast({
        message: 'Avaliação enviada com sucesso!',
        variant: 'success',
      });
      closeModal();
      loadData();
    } catch (error: any) {
      showToast({
        message: error.message || 'Erro ao enviar avaliação',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = productsToReview.filter((product) => {
    if (filter === 'avaliados') return hasRating(product.productId);
    if (filter === 'nao-avaliados') return !hasRating(product.productId);
    return true;
  });

  if (isLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-8">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu Lateral */}
          <AccountSidebar />

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Star className="text-blue-600" size={28} /> Avaliações
              </h1>
              <p className="text-gray-600">
                Aqui você consegue avaliar e opinar sobre os produtos que comprou!
              </p>
            </div>

            {/* Filtros */}
            <div className="mb-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="todos">Mais Recentes</option>
              </select>
            </div>

            {/* Tabs de filtro */}
            <div className="flex gap-6 mb-6 border-b border-gray-300">
              <button
                onClick={() => setFilter('todos')}
                className={`pb-2 font-medium ${
                  filter === 'todos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('avaliados')}
                className={`pb-2 font-medium ${
                  filter === 'avaliados'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Avaliados
              </button>
              <button
                onClick={() => setFilter('nao-avaliados')}
                className={`pb-2 font-medium ${
                  filter === 'nao-avaliados'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Não avaliados
              </button>
            </div>

            {/* Lista de produtos */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">Nenhum produto encontrado para avaliar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
              <div
                    key={`${product.productId}-${product.orderId}-${index}`}
                    className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
                  >
                    {/* Imagem do produto */}
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-20 h-20 object-cover rounded"
                    />

                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">PRODUTO</h3>
                      <p className="text-sm text-gray-600">{product.productName}</p>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">NÚMERO DO PEDIDO</h3>
                      <p className="text-sm text-gray-600">#{product.orderId.slice(0, 8)}</p>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">DATA DA COMPRA</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(product.orderDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Botão */}
                    <div className="w-full md:w-auto">
                      {hasRating(product.productId) ? (
                        <button
                          disabled
                          className="w-full md:w-auto px-6 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                        >
                          PRODUTO AVALIADO
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal(product)}
                          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                          AVALIAR PRODUTO
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de Avaliação */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  O que você achou do produto?
                </h2>
                <button
                  onClick={closeModal}
                  className="text-blue-600 hover:text-blue-800 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Produto */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <p className="text-gray-700 font-medium">{selectedProduct.productName}</p>
              </div>

              <form onSubmit={handleSubmitRating}>
                {/* Avaliação por estrelas */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Que nota você dá para o produto? <span className="text-red-500">(obrigatório)</span>
                  </label>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={36}
                          className={`${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-none text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {rating === 0 ? '(0)' : `(${rating})`}
                    </span>
                  </div>
                </div>

                {/* Comentário */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escreva sua avaliação:
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    rows={6}
                    placeholder="No geral, o que você achou do produto?"
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {comment.length}/1000
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={rating === 0 || submitting}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Enviando...' : 'ENVIAR AVALIAÇÃO'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
