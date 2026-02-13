"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { useToast } from "@/components/ui/use-toast";
import { ProductGrid } from "../components/product-grid";
import { ProductModal } from "../components/product-modal";
import { SearchBar } from "../components/search-bar";
import { SortSelect } from "../components/sort-select";
import { CategorySelect } from "../components/category-select";
import { Pagination } from "../components/pagination";
import { ResultsMeta } from "../components/results-meta";
import { EmptyState } from "../components/empty-state";
import { useProductsQuery, PAGE_SIZE } from "../hooks/useProductsQuery";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { Product, SortOption, SortOrder } from "../types";

const SEARCH_DEBOUNCE_MS = 300;

export function ProductsDashboardView() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setCurrentPage(1);
  }, SEARCH_DEBOUNCE_MS);

  const {
    products,
    total,
    isLoading,
    isError,
    error,
    isFetching,
  } = useProductsQuery({
    limit: PAGE_SIZE,
    skip: (currentPage - 1) * PAGE_SIZE,
    sortBy,
    order: sortOrder,
    searchQuery: debouncedSearch || undefined,
    category,
  });

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  const handleSortChange = (newSortBy: SortOption, newOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory: string | undefined) => {
    setCategory(newCategory);
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
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our curated collection of quality products
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 sm:max-w-md min-w-0"
            />
            <CategorySelect
              value={category}
              onChange={handleCategoryChange}
              className="sm:w-[180px]"
            />
            <SortSelect
              sortBy={sortBy}
              order={sortOrder}
              onSortChange={handleSortChange}
              className="sm:w-48"
            />
          </div>
        </div>

        {!isFetching && products.length > 0 && (
          <ResultsMeta
            total={total}
            currentCount={products.length}
            searchQuery={debouncedSearch || undefined}
            category={category}
          />
        )}

        {isError ? (
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
                <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
              </div>
            </div>
          </div>
        ) : products.length === 0 && !isFetching ? (
          <EmptyState />
        ) : (
          <ProductGrid
            products={products}
            loading={isFetching}
            onProductClick={handleProductClick}
          />
        )}

        {!isFetching && products.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="pt-4"
          />
        )}

        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </div>
  );
}
