import React from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { formatPrice, formatRealCost } from '../utils/formatters';
import { Plus, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  actionLabel?: string;
  showInspectButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  actionLabel,
  showInspectButton = true,
}) => {
  const { cart, addToCart, removeFromCart, openProduct, currency } = useStore();

  const isAdded = cart.some((item) => item.product.id === product.id);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) {
      removeFromCart(product.id);
    } else {
      addToCart(product, 1);
    }
  };

  const getTagColorClass = () => {
    if (product.tagType === 'danger') return 'bg-[#ba0900] text-white';
    if (product.tagType === 'mint') return 'bg-[#006c49] text-white';
    if (product.tagType === 'warning') return 'bg-[#ba0900] text-white';
    return 'bg-[#1a1c1a] text-[#faf9f6]';
  };

  const buttonText = actionLabel || (isAdded ? '✓ In Fantasy Cart' : '+ Add to Fantasy');

  return (
    <article
      onClick={() => openProduct(product.id)}
      className="bg-white rounded-xl overflow-hidden shadow-tactile-sm border border-[#1a1c1a] hover:shadow-tactile transition-all duration-200 flex flex-col cursor-pointer group"
    >
      {/* Media Module */}
      <div className="relative w-full h-52 bg-[#efeeeb] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          width={1200}
          height={800}
          sizes="(max-width: 640px) 100vw, 448px"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Satire Badge Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`${getTagColorClass()} px-2.5 py-1 rounded text-[11px] font-extrabold tracking-wider uppercase shadow-sm`}
          >
            {product.tag}
          </span>
        </div>

        {/* Real Cost Top/Bottom Right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-[#faf9f6]/95 backdrop-blur-md text-[#1a1c1a] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border border-[#1a1c1a]/15 shadow-sm">
            {formatRealCost(currency)} REAL COST
          </span>
        </div>

        {product.subBadge && product.subBadge !== '$0 REAL COST' && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-[#1a1c1a]/85 backdrop-blur-md text-[#faf9f6] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {product.subBadge}
            </span>
          </div>
        )}
      </div>

      {/* Details & Interactive CTA */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bodoni font-bold text-lg uppercase text-[#1a1c1a] leading-tight group-hover:text-[#ba0900] transition-colors">
              {product.title}
            </h3>
          </div>
          {/* One-line hook for the card */}
          <p className="text-xs text-[#5d5c5b] line-clamp-2 leading-relaxed">
            {product.hook || product.description}
          </p>
        </div>

        {/* Pricing Strip & Action Button */}
        <div className="pt-2 border-t border-[#efeeeb] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] line-through text-[#926f69] font-medium">
              MSRP: {formatPrice(product.msrp, currency)}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-bodoni font-black text-2xl text-[#ba0900] leading-none">
                {formatRealCost(currency)}
              </span>
              <span className="text-[10px] font-bold uppercase text-[#006c49]">
                Zero Owed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleCart}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
                isAdded
                  ? 'bg-[#006c49] text-white hover:bg-[#005236]'
                  : 'bg-[#ba0900] text-white hover:bg-[#920500]'
              }`}
            >
              {isAdded ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              )}
              <span>{buttonText}</span>
            </button>

            {showInspectButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openProduct(product.id);
                }}
                className="p-2.5 bg-[#f4f3f0] hover:bg-[#e9e8e5] text-[#1a1c1a] border border-[#1a1c1a]/30 rounded-lg transition-colors active:scale-95"
                title="Inspect Product Specifications"
              >
                <Eye className="w-4 h-4 text-[#1a1c1a]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
