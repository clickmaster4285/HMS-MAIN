// components/StatsCard.jsx
import React from 'react';
import {
   Users,
   DollarSign,
   Home,
   Activity,
   TrendingUp,
   TrendingDown,
   Clipboard,
   User,
   Hospital,
   Wallet,
   CreditCard,
   Package,
   Calendar,
   Stethoscope,
   Heart,
   Eye,
   Brain,
   AlertCircle,
   CheckCircle,
   XCircle
} from 'lucide-react';

const StatsCard = ({ title, value, icon, color, subValue, trend, trendValue, onClick }) => {
   // Color schemes with neutral palette
   const colorSchemes = {
      sky: {
         border: 'border-l-sky-500',
         bg: 'bg-sky-50',
         icon: 'text-sky-600',
         trendUp: 'text-sky-700',
         trendDown: 'text-sky-400'
      },
      green: {
         border: 'border-l-emerald-500',
         bg: 'bg-emerald-50',
         icon: 'text-emerald-600',
         trendUp: 'text-emerald-700',
         trendDown: 'text-emerald-400'
      },
      amber: {
         border: 'border-l-amber-500',
         bg: 'bg-amber-50',
         icon: 'text-amber-600',
         trendUp: 'text-amber-700',
         trendDown: 'text-amber-400'
      },
      rose: {
         border: 'border-l-rose-500',
         bg: 'bg-rose-50',
         icon: 'text-rose-600',
         trendUp: 'text-rose-700',
         trendDown: 'text-rose-400'
      },
      violet: {
         border: 'border-l-violet-500',
         bg: 'bg-violet-50',
         icon: 'text-violet-600',
         trendUp: 'text-violet-700',
         trendDown: 'text-violet-400'
      },
      slate: {
         border: 'border-l-slate-500',
         bg: 'bg-slate-50',
         icon: 'text-slate-600',
         trendUp: 'text-slate-700',
         trendDown: 'text-slate-400'
      },
      teal: {
         border: 'border-l-teal-500',
         bg: 'bg-teal-50',
         icon: 'text-teal-600',
         trendUp: 'text-teal-700',
         trendDown: 'text-teal-400'
      },
      indigo: {
         border: 'border-l-indigo-500',
         bg: 'bg-indigo-50',
         icon: 'text-indigo-600',
         trendUp: 'text-indigo-700',
         trendDown: 'text-indigo-400'
      }
   };

   const scheme = colorSchemes[color] || colorSchemes.slate;

   // Icon mapping
   const iconMap = {
      users: <Users className="w-5 h-5" />,
      dollar: <DollarSign className="w-5 h-5" />,
      home: <Home className="w-5 h-5" />,
      activity: <Activity className="w-5 h-5" />,
      trendingUp: <TrendingUp className="w-5 h-5" />,
      trendingDown: <TrendingDown className="w-5 h-5" />,
      clipboard: <Clipboard className="w-5 h-5" />,
      user: <User className="w-5 h-5" />,
      hospital: <Hospital className="w-5 h-5" />,
      wallet: <Wallet className="w-5 h-5" />,
      creditCard: <CreditCard className="w-5 h-5" />,
      package: <Package className="w-5 h-5" />,
      calendar: <Calendar className="w-5 h-5" />,
      stethoscope: <Stethoscope className="w-5 h-5" />,
      heart: <Heart className="w-5 h-5" />,
      eye: <Eye className="w-5 h-5" />,
      brain: <Brain className="w-5 h-5" />,
      alert: <AlertCircle className="w-5 h-5" />,
      check: <CheckCircle className="w-5 h-5" />,
      xCircle: <XCircle className="w-5 h-5" />
   };

   return (
      <div
         className={`relative overflow-hidden rounded-xl ${scheme.bg} ${scheme.border} border-l-4 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 drop-shadow-gray-300 drop-shadow-xl  ${onClick ? 'cursor-pointer' : ''
            }`}
         onClick={onClick}
      >
         {/* Background decorative element */}
         <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-current"></div>

         <div className="relative flex items-start justify-between mb-4">
            <div className="flex-1">
               <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
               <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  {trend && trendValue && (
                     <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up'
                              ? 'bg-emerald-100 text-emerald-700'
                              : trend === 'down'
                                 ? 'bg-rose-100 text-rose-700'
                                 : 'bg-slate-100 text-slate-700'
                           }`}
                     >
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                     </span>
                  )}
               </div>
               {subValue && (
                  <p className="text-sm text-slate-500 mt-2">{subValue}</p>
               )}
            </div>
            <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.icon}`}>
               {iconMap[icon] || icon}
            </div>
         </div>

         {/* Progress bar for trend visualization */}
         {trend === 'up' || trend === 'down' ? (
            <div className="relative h-1 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
               <div
                  className={`absolute h-full rounded-full ${trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'
                     }`}
                  style={{ width: trendValue ? `${Math.min(100, parseInt(trendValue))}%` : '50%' }}
               ></div>
            </div>
         ) : null}
      </div>
   );
};

export default StatsCard;