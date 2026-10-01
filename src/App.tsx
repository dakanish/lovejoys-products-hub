import React, { useState, useMemo } from 'react';
import { Search, Info, Clock, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import productsData from './data/products.json';

interface Product {
  id: number;
  name: string;
  fastakey: string;
  variety: string;
  size: string;
  units: string;
  mainCategory: string;
  subCategory: string;
  isPreOrder: boolean;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRule, setActiveRule] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(productsData.map((p) => p.mainCategory)));
    return ['All', ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    const tokens = trimmed.split(/\s+/).filter(Boolean);

    return (productsData as Product[]).filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.mainCategory === activeCategory;
      if (!matchesCategory) return false;

      if (tokens.length === 0) return true;

      const searchableText = `
        ${product.name} 
        ${product.fastakey} 
        ${product.variety} 
        ${product.id} 
        ${product.size}
      `.toLowerCase();

      return tokens.every((token) => searchableText.includes(token));
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Live Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Lovejoys Hub
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Direct Product Catalogue, FASTAKEY Finder & Ordering Playbook
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or FASTAKEY (e.g. salt, scrown)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {/* Guidance Playbook Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-indigo-400" /> Operational Playbook & SOPs
            </h2>
            <span className="text-[11px] text-slate-500">Click a card for advice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => setActiveRule(activeRule === 'bakery' ? null : 'bakery')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeRule === 'bakery'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Customer wants Fresh Bakery?</span>
                <span className="flex items-center gap-1 text-indigo-400 font-mono text-[11px]">
                  <Clock className="h-3 w-3" /> 14:00 Cut-Off
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Bake-to-order schedule. Cannot fulfill same-day once bake sheet is finalized.
              </p>
              {activeRule === 'bakery' && (
                <ul className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <li>• Confirm next-day bake schedule before locking order.</li>
                  <li>• Check minimum case requirements for sliced artisan sourdoughs.</li>
                  <li>• Late additions require dispatch supervisor sign-off.</li>
                </ul>
              )}
            </div>

            <div
              onClick={() => setActiveRule(activeRule === 'preorder' ? null : 'preorder')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeRule === 'preorder'
                  ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Specialty Line / Pre-Order?</span>
                <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> 24h - 48h
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Artisan cheeses, fresh yeast, and fragile seasonal produce lead times.
              </p>
              {activeRule === 'preorder' && (
                <ul className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <li>• Fresh Yeast and specific cheeses ship on set days (e.g. Fri goat milk).</li>
                  <li>• Never commit same-day dispatch for pre-order tagged items.</li>
                </ul>
              )}
            </div>

            <div
              onClick={() => setActiveRule(activeRule === 'prep' ? null : 'prep')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeRule === 'prep'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Prepared Veg & Potatoes?</span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <ShieldCheck className="h-3 w-3" /> Prep Room
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Rumbled, batoned, or hand-diced products schedule cut-offs.
              </p>
              {activeRule === 'prep' && (
                <ul className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <li>• Order cuts must be submitted before the nightly prep run begins.</li>
                  <li>• Verify bag sizes (2.5kg vs 10kg) with customer prior to ordering.</li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <main className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> items
            </span>
            {searchTerm && (
              <span>
                Matching: <strong className="text-indigo-400">"{searchTerm}"</strong>
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
            {filteredProducts.slice(0, 150).map((product) => (
              <div
                key={product.id}
                className="p-3.5 md:p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <span className="text-xs font-mono font-medium text-slate-500 w-12 shrink-0">
                    #{product.id}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {product.name}
                      </span>
                      {product.isPreOrder && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-semibold shrink-0">
                          PRE-ORDER
                        </span>
                      )}
                    </div>
                    {product.variety && (
                      <p className="text-xs text-slate-400 italic truncate mt-0.5">
                        Var: {product.variety}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  {product.size && (
                    <span className="text-xs px-2.5 py-1 bg-slate-800/80 text-slate-300 rounded-md border border-slate-700/60 hidden sm:inline-block">
                      {product.size} {product.units ? `(${product.units})` : ''}
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 rounded-md">
                    {product.fastakey || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}