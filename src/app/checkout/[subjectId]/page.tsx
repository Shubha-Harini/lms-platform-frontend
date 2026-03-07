'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      apiClient.get(`/subjects/${subjectId}`)
        .then(res => {
          setSubject(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load course details.");
          setLoading(false);
        });
    }
  }, [subjectId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    // Mock payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await apiClient.post(`/subjects/${subjectId}/enroll`);
      setSuccess(true);
      setProcessing(false);

      // Auto redirect after success
      setTimeout(() => {
        router.push(`/subjects/${subjectId}`);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted text-[10px] font-bold uppercase tracking-widest animate-pulse">Establishing Secure Session</p>
    </div>
  );

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-10 max-w-sm w-full space-y-5 bg-white border border-border"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Access Granted!</h1>
        <p className="text-muted text-xs leading-relaxed font-medium">
          Welcome to <span className="text-foreground font-bold">{subject?.title}</span>. Your enrollment is complete. Redirecting to your dashboard...
        </p>
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Course Summary */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Final Step</h1>
            <p className="text-muted text-sm font-medium">Complete your enrollment to begin your journey with {subject?.title}.</p>
          </div>

          <div className="glass-card overflow-hidden bg-white border border-border shadow-sm">
            <img
              src={subject?.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
              className="w-full h-40 object-cover border-b border-border"
              alt={subject?.title}
            />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{subject?.title}</h3>
                  <p className="text-muted text-[10px] uppercase font-bold tracking-widest mt-1">Full Mastery Certification</p>
                </div>
                <span className="text-xl font-bold text-accent">₹{subject?.price || '49.99'}</span>
              </div>

              <div className="space-y-2 pt-4 border-t border-border text-[11px] font-medium text-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SSL Encrypted Transmission</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 md:p-8 bg-white border border-border shadow-lg"
        >
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-accent bg-accent/5 p-3 rounded-lg flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-foreground">Card</span>
                  </div>
                  <div className="w-3 h-3 rounded-full border-2 border-accent"></div>
                </div>
                <div className="border border-border p-3 rounded-lg flex items-center justify-between cursor-not-allowed opacity-40 grayscale">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded text-[6px] flex items-center justify-center font-bold text-gray-500 uppercase italic">PP</div>
                    <span className="text-xs font-bold text-muted">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Card Details</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-accent outline-none font-medium placeholder:text-muted/40"
                    required
                  />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-accent outline-none font-medium placeholder:text-muted/40"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-accent outline-none font-medium placeholder:text-muted/40"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-accent outline-none font-medium placeholder:text-muted/40"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2.5 text-red-500 text-[11px] font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full premium-button-primary !py-3 flex items-center justify-center gap-2 text-sm"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing...
                </>
              ) : (
                <>
                  Pay Securely <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-muted">
              By clicking "Pay Securely", you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Refund Policy</span>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
