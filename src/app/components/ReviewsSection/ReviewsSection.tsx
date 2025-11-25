'use client';

import React, { useState, useEffect } from 'react';
import { Rating } from '@/app/types';
import { ratingService } from '@/app/services/ratingService';
import { cartService } from '@/app/services/cartService';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import StarRating from '../StarRating/StarRating';
import Link from 'next/link';

interface ReviewsSectionProps {
  productId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  const [newRate, setNewRate] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRatings = async () => {
    try {
      const data = await ratingService.getRatingsByProduct(productId);
      setRatings(data);
      
      if (user) {
        const userReview = data.find((rating) => rating.userId === user.id);
        setHasAlreadyReviewed(!!userReview);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfUserPurchased = async () => {
    if (!user || !token) {
      setCheckingPurchase(false);
      return;
    }

    try {
      const orders = await cartService.getMyOrders(user.id, token);
      
      // Verifica se o usuário tem algum pedido finalizado (PAID ou DELIVERED) contendo este produto
      const purchased = orders.some((order: any) => 
        (order.status === 'PAID' || order.status === 'DELIVERED') &&
        order.items.some((item: any) => item.product.id === productId)
      );
      
      setHasPurchased(purchased);
    } catch (error) {
      console.error('Erro ao verificar compra:', error);
    } finally {
      setCheckingPurchase(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [productId, user]);

  useEffect(() => {
    checkIfUserPurchased();
  }, [user, token, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !user) {
      showToast({
        message: 'Você precisa estar logado para avaliar!',
        variant: 'info',
      });
      return;
    }

    if (hasAlreadyReviewed) {
      showToast({
        message: 'Você já avaliou este produto!',
        variant: 'info',
      });
      return;
    }

    if (!hasPurchased) {
      showToast({
        message: 'Você precisa comprar o produto para poder avaliá-lo!',
        variant: 'info',
      });
      return;
    }

    if (newRate === 0) {
      showToast({
        message: 'Por favor, selecione uma nota!',
        variant: 'info',
      });
      return;
    }

    setSubmitting(true);
    try {
      await ratingService.createRating(productId, user.id, newRate, newComment, token);
      setNewRate(0);
      setNewComment('');
      await loadRatings();
      showToast({
        message: 'Avaliação enviada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      showToast({
        message: error.message || 'Erro ao enviar avaliação',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Carregando avaliações...</p>;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Avaliações dos Clientes</h2>

      <div className="space-y-6 mb-10">
        {ratings.length === 0 ? (
          <p className="text-gray-500">Este produto ainda não tem avaliações. Seja o primeiro!</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800">{rating.user?.name || 'Usuário'}</div>
                <span className="text-xs text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={rating.rate} size={16} />
              {rating.comment && <p className="mt-2 text-gray-700 text-sm">{rating.comment}</p>}
            </div>
          ))
        )}
      </div>

      <div className="bg-white border p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Deixe sua avaliação</h3>

        {!user ? (
          <div className="text-center py-4 bg-gray-50 rounded">
            <p className="text-gray-600 mb-2">Você precisa estar logado para avaliar.</p>
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Fazer Login
            </Link>
          </div>
        ) : checkingPurchase ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Verificando...</p>
          </div>
        ) : hasAlreadyReviewed ? (
          <div className="text-center py-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-gray-700 mb-1">
              Você já avaliou este produto!
            </p>
          </div>
        ) : !hasPurchased ? (
          <div className="text-center py-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-gray-700 mb-1">
              Você precisa comprar este produto para poder avaliá-lo.
            </p>
            <p className="text-sm text-gray-600">
              Apenas clientes que adquiriram o produto podem deixar avaliações.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sua nota</label>
              <StarRating rating={newRate} interactive onRate={setNewRate} size={28} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comentário (opcional)</label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Conte o que achou do produto..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
