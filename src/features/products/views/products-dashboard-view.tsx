"use client";

import { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/layout/container";
import { useToast } from "@/components/ui/use-toast";
import { searchProducts } from "../api/queries/searchProducts";
import { sortProductsAPI } from "../api/queries/sortProducts";
import { ProductGrid } from "../components/product-grid";
import { ProductModal } from "../components/product-modal";
import { SearchBar } from "../components/search-bar";
import { SortSelect } from "../components/sort-select";
import { Pagination } from "../components/pagination";
import { ResultsMeta } from "../components/results-meta";
import { EmptyState } from "../components/empty-state";
import { sortProducts as sortProductsClient } from "../utils";
import type {
  Product,
  ProductsResponse,
  SortOption,
  SortOrder,
} from "../types";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

export function ProductsDashboardView() {
  const { toast } = useToast();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Modal
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products
  const fetchProducts = async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const skip = (currentPage - 1) * PAGE_SIZE;
      let response: ProductsResponse;

      // Priority: search > default with sorting
      if (searchQuery) {
        response = await searchProducts(
          { q: searchQuery, limit: PAGE_SIZE, skip },
          signal,
        );
        // Client-side sort for search results
        response.products = sortProductsClient(
          response.products,
          sortBy,
          sortOrder,
        );
      } else {
        // Server-side sort for default view
        response = await sortProductsAPI(
          sortBy,
          sortOrder,
          PAGE_SIZE,
          skip,
          signal,
        );
      }

      setProducts(response.products);
      setTotal(response.total);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const abortController = new AbortController();

    const timer = setTimeout(
      () => {
        fetchProducts(abortController.signal);
      },
      searchQuery ? SEARCH_DEBOUNCE_MS : 0,
    );

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: SortOption, newOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-7xl py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our curated collection of quality products
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 sm:max-w-md"
            />
            <SortSelect
              sortBy={sortBy}
              order={sortOrder}
              onSortChange={handleSortChange}
              className="sm:w-48"
            />
          </div>
        </div>

        {/* Results Meta */}
        {!loading && products.length > 0 && (
          <ResultsMeta
            total={total}
            currentCount={products.length}
            searchQuery={searchQuery}
          />
        )}

        {/* Products Grid */}
        {error ? (
          <div className="py-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Error Loading Products
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        ) : products.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
            onProductClick={handleProductClick}
          />
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="pt-4"
          />
        )}

        {/* Product Modal */}
        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </div>
  );
}
