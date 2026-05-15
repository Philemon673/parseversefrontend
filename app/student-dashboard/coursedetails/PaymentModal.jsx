"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  Lock,
  CheckCircle,
  Check,
  Globe,
  BookOpen,
} from "lucide-react";

export default function PaymentModal({ isOpen, onClose, course }) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Payment Method, 2: Card Details, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleStartLearning = () => {
    onClose();
    setStep(1);
    router.push(`/student-dashboard/coursedetails/courses/coursedetails?courseId=${course.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      handleStartLearning();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Complete Your Enrollment</h2>
            <p className="text-sm text-slate-500 mt-1">Secure checkout powered by Stripe</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    step > s ? 'bg-indigo-600' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-2">
            <span className="text-xs font-semibold text-slate-600">Payment</span>
            <span className="text-xs font-semibold text-slate-600">Details</span>
            <span className="text-xs font-semibold text-slate-600">Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'MTN Mobile Money', icon: CreditCard, desc: 'Pay with your MTN Mobile Money account' },
                    { id: 'paypal', label: 'ORANGE Money', icon: Globe, desc: 'Pay with your ORANGE Money account' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === method.id ? 'bg-indigo-600' : 'bg-slate-100'
                      }`}>
                        <method.icon className={`w-6 h-6 ${
                          paymentMethod === method.id ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-slate-900">{method.label}</p>
                        <p className="text-sm text-slate-500">{method.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300'
                      }`}>
                        {paymentMethod === method.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
              >
                Continue to Payment Details
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="w-20 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 font-semibold text-sm">
                        +237
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 9) {
                            setFormData({...formData, phoneNumber: value});
                          }
                        }}
                        placeholder="6 XX XX XX XX"
                        maxLength="9"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Enter 9-digit phone number</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{course.title}</p>
                      <p className="text-xs text-slate-500 mt-1">By {course.instructor.name}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Original Price</span>
                      <span className="text-slate-400 line-through">${course.originalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Discount ({course.discountPercent}%)</span>
                      <span className="text-emerald-600 font-semibold">-${course.originalPrice - course.discountedPrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-200">
                      <span className="text-slate-900">Total</span>
                      <span className="text-indigo-600">${course.discountedPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  Complete Payment
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h3>
              <p className="text-slate-600 mb-6">You're now enrolled in {course.title}</p>
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-sm text-slate-600 mb-4">A confirmation email has been sent to your inbox with course access details.</p>
                <button
                  onClick={handleStartLearning}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  Start Learning Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
