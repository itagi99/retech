"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, TrendingUp, Clock, Zap, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  type: "product" | "category" | "brand" | "recent";
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
  href: string;
}

const RECENT_SEARCHES_KEY = "retech-recent-searches";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 200;

export default function SearchBar({ 
  placeholder = "Search products, brands, categories...",
  className = "",
  showRecent = true 
}: { 
  placeholder?: string; 
  className?: string;
  showRecent?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  // Save recent search
  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== search.toLowerCase());
      const updated = [search, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(showRecent && recentSearches.length > 0);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // In real app, call API: /api/search/suggestions?q=${query}
        // For now, mock suggestions based on query
        const mockSuggestions: SearchSuggestion[] = [
          // Products matching query
          ...[
            { id: "1", label: "MacBook Pro 16 M3 Max", subtitle: "Apple • ₹2,49,900", href: "/products/macbook-pro-16-m3-max", type: "product" as const, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" },
            { id: "2", label: "Dell XPS 15 9530", subtitle: "Dell • ₹1,29,900", href: "/products/dell-xps-15-9530", type: "product" as const, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100&h=100&fit=crop" },
            { id: "3", label: "ASUS ROG Zephyrus G16", subtitle: "ASUS • ₹1,89,900", href: "/products/asus-rog-zephyrus-g16", type: "product" as const, image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=100&h=100&fit=crop" },
            { id: "4", label: "iPhone 15 Pro", subtitle: "Apple • ₹1,34,900", href: "/products/iphone-15-pro", type: "product" as const, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop" },
          ].filter(p => p.label.toLowerCase().includes(query.toLowerCase())),
          
          // Categories
          ...[
            { id: "cat-1", label: "Laptops", subtitle: "Gaming, Business, Ultrabooks", href: "/products?category=laptops", type: "category" as const },
            { id: "cat-2", label: "Gaming", subtitle: "Laptops, Desktops, Accessories", href: "/products?category=gaming", type: "category" as const },
            { id: "cat-3", label: "Smartphones", subtitle: "iPhone, Samsung, OnePlus", href: "/products?category=smartphones", type: "category" as const },
            { id: "cat-4", label: "Audio", subtitle: "Headphones, Earbuds, Speakers", href: "/products?category=audio", type: "category" as const },
          ].filter(c => c.label.toLowerCase().includes(query.toLowerCase())),

          // Brands
          ...[
            { id: "br-1", label: "Apple", subtitle: "MacBook, iPhone, iPad, Watch", href: "/products?brand=apple", type: "brand" as const },
            { id: "br-2", label: "Dell", subtitle: "XPS, Inspiron, Alienware", href: "/products?brand=dell", type: "brand" as const },
            { id: "br-3", label: "ASUS", subtitle: "ROG, ZenBook, Vivobook", href: "/products?brand=asus", type: "brand" as const },
            { id: "br-3", label: "Samsung", subtitle: "Galaxy, Odyssey, SSDs", href: "/products?brand=samsung", type: "brand" as const },
          ].filter(b => b.label.toLowerCase().includes(query.toLowerCase())),
        ];

        setSuggestions(mockSuggestions.slice(0, 8));
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, showRecent, recentSearches]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        if (selected) {
          addRecentSearch(query);
          window.location.href = selected.href;
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    addRecentSearch(query);
    window.location.href = suggestion.href;
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(showRecent && recentSearches.length > 0);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)} ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 pl-11 pr-11 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          autoComplete="off"
          spellCheck={false}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        
        {isLoading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || (showRecent && recentSearches.length > 0)) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-slide-in-down">
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                Suggestions
              </div>
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={suggestion.id}
                    href={suggestion.href}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-colors",
                      selectedIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                  >
                    {suggestion.image && (
                      <img src={suggestion.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.label}</p>
                      {suggestion.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</p>
                      )}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded capitalize text-muted-foreground">
                      {suggestion.type}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {showRecent && recentSearches.length > 0 && suggestions.length === 0 && (
            <div>
              <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                Recent Searches
                <button onClick={clearRecentSearches} className="text-xs text-muted-foreground hover:text-foreground">
                  Clear all
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {recentSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => {
                      addRecentSearch(search);
                      window.location.href = `/products?search=${encodeURIComponent(search)}`;
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                      selectedIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          {suggestions.length === 0 && recentSearches.length === 0 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Trending Now</p>
              <div className="flex flex-wrap gap-2">
                {["Gaming Laptops", "iPhone 15", "MacBook Air", "4K Monitors", "Wireless Earbuds", "SSD 1TB"].map((trend, i) => (
                  <button
                    key={trend}
                    onClick={() => {
                      addRecentSearch(trend);
                      window.location.href = `/products?search=${encodeURIComponent(trend)}`;
                    }}
                    className="px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <TrendingUp className="h-3 w-3 mr-1.5" />
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}