'use client';

import React, { useState, useEffect } from 'react';
import { Rating } from '@/app/types';
import { ratingService } from '@/app/services/ratingService';
import { useAuth } from '@/app/context/AuthContext'; 
import StarRating from '../StarRating/StarRating';
import Link from 'next/link';

interface ReviewsSectionProps {
  productId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const { user, token } = useAuth(); 
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newRate, setNewRate] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRatings = async () => {
    try {
      const data = await ratingService.getRatingsByProduct(productId);
      setRatings(data);
    } catch (error) {
      console.error("Erro ao carregar avaliações", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando enviar...", { user, token, newRate });
    if (!token || !user) {
        alert("Você precisa estar logado para avaliar!");
    }
    if (newRate === 0) return alert("Por favor, selecione uma nota!");

    setSubmitting(true);
    try {
      await ratingService.createRating(productId, user.id, newRate, newComment, token);
      setNewRate(0);
      setNewComment('');
      await loadRatings(); 
      alert("Avaliação enviada com sucesso!");
    } catch (error) {
      alert("Erro ao enviar: " + error);
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
                <div className="font-semibold text-gray-800">
                  {rating.user?.name || "Usuário"}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={rating.rate} size={16} />
              {rating.comment && (
                <p className="mt-2 text-gray-700 text-sm">{rating.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-white border p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Deixe sua avaliação</h3>
        
        {user ? (
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
              {submitting ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded">
            <p className="text-gray-600 mb-2">Você precisa estar logado para avaliar.</p>
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Fazer Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;