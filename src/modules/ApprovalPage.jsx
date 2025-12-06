


import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, TrendingUp, BookOpen, Layers, FileText, DollarSign, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const approvalModules = [
  {
    key: 'purchase',
    icon: <ShoppingCart className="text-blue-500" size={32} />, // Purchase
    title: { en: 'Purchase', bn: 'ক্রয়' },
    types: [
      {
        key: 'order',
        icon: <FileText className="text-blue-400" size={28} />,
        label: { en: 'Purchase Order', bn: 'ক্রয় অর্ডার' },
        count: 312,
      },
      {
        key: 'payment',
        icon: <DollarSign className="text-green-400" size={28} />,
        label: { en: 'Purchase Payment', bn: 'ক্রয় পেমেন্ট' },
        count: 2223,
      },
      {
        key: 'return',
        icon: <RefreshCcw className="text-red-400" size={28} />,
        label: { en: 'Purchase Return', bn: 'ক্রয় রিটার্ন' },
        count: 1333,
      },
    ],
  },
  {
    key: 'sales',
    icon: <TrendingUp className="text-green-500" size={32} />, // Sales
    title: { en: 'Sales', bn: 'বিক্রয়' },
    types: [
      {
        key: 'order',
        icon: <FileText className="text-green-400" size={28} />,
        label: { en: 'Sales Order', bn: 'বিক্রয় অর্ডার' },
        count: 400,
      },
      {
        key: 'collection',
        icon: <DollarSign className="text-blue-400" size={28} />,
        label: { en: 'Sales Collection', bn: 'বিক্রয় কালেকশন' },
        count: 289,
      },
      {
        key: 'return',
        icon: <RefreshCcw className="text-red-400" size={28} />,
        label: { en: 'Sales Return', bn: 'বিক্রয় রিটার্ন' },
        count: 199,
      },
    ],
  },
  {
    key: 'accounts',
    icon: <BookOpen className="text-purple-500" size={32} />, // Accounts
    title: { en: 'Accounts', bn: 'হিসাব' },
    types: [
      {
        key: 'journal',
        icon: <FileText className="text-purple-400" size={28} />,
        label: { en: 'Account Journal', bn: 'অ্যাকাউন্ট জার্নাল' },
        count: 277,
      },
      {
        key: 'expense',
        icon: <DollarSign className="text-pink-400" size={28} />,
        label: { en: 'Expense/Advance', bn: 'খরচ/অ্যাডভান্স' },
        count: 177,
      },
    ],
  },
  {
    key: 'inventory',
    icon: <Layers className="text-orange-500" size={32} />, // Inventory
    title: { en: 'Inventory', bn: 'ইনভেন্টরি' },
    types: [
      {
        key: 'adjustment',
        icon: <RefreshCcw className="text-orange-400" size={28} />,
        label: { en: 'Stock Adjustment', bn: 'স্টক অ্যাডজাস্টমেন্ট' },
        count: 176,
      },
    ],
  },
];

export default function ApprovalPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('bn') ? 'bn' : 'en';
  const navigate = useNavigate();

  // Map type.key to landing page route
  const getRoute = (moduleKey, typeKey) => {
    if (moduleKey === 'purchase' && typeKey === 'order') return '/approval/purchase-order';
    if (moduleKey === 'purchase' && typeKey === 'payment') return '/approval/purchase-payment';
    if (moduleKey === 'purchase' && typeKey === 'return') return '/approval/purchase-return';
    if (moduleKey === 'sales' && typeKey === 'order') return '/approval/sales-order';
    if (moduleKey === 'sales' && typeKey === 'collection') return '/approval/sales-collection';
    if (moduleKey === 'sales' && typeKey === 'return') return '/approval/sales-return';
    if (moduleKey === 'accounts' && typeKey === 'journal') return '/approval/account-journal';
    if (moduleKey === 'accounts' && typeKey === 'expense') return '/approval/expense-advance';
    if (moduleKey === 'inventory' && typeKey === 'adjustment') return '/approval/stock-adjustment';
    return '#';
  };

  // Animation variants for container and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 py-2">
      <h1 className="page-title mb-6 flex items-center justify-center drop-shadow-lg">{t('menu.approval')}</h1>
      <div className="flex flex-col gap-8">
        {approvalModules.map((module, mIdx) => (
          <div key={module.key}>
            <div className="flex items-center gap-2 mb-3">
              {module.icon}
              <span className="text-xl font-bold text-gray-800">{module.title[lang]}</span>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {module.types.map((type, tIdx) => (
                <motion.div
                  key={type.key}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all p-5 flex flex-col items-center justify-center min-h-[120px] cursor-pointer select-none"
                  onClick={() => navigate(getRoute(module.key, type.key))}
                  variants={cardVariants}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(80,80,180,0.13)" }}
                >
                  <div className="mb-2">{type.icon}</div>
                  <div className="text-base font-semibold text-gray-700 text-center mb-1">{type.label[lang]}</div>
                  <div className="text-2xl font-bold text-primary mt-2">{type.count}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
