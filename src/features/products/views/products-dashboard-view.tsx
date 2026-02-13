"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "../components/product-grid";
import { ProductModal } from "../components/product-modal";
import { SearchBar } from "../components/search-bar";
import { SortSelect } from "../components/sort-select";
import { CategorySelect } from "../components/category-select";
import { Pagination } from "../components/pagination";
import { ResultsMeta } from "../components/results-meta";
import { EmptyState } from "../components/empty-state";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type {
  Product,
  SortOption,
  SortOrder,
  CategoryOption,
} from "../types";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

interface ProductsDashboardViewProps {
  initialProducts: Product[];
  initialTotal: number;
  initialPage: number;
  initialSearch: string;
  initialCategory: string;
  initialCategoryName: string;
  initialCategories: CategoryOption[];
  initialSortBy: SortOption;
  initialSortOrder: SortOrder;
}

export function ProductsDashboardView({
  initialProducts,
  initialTotal,
  initialPage,
  initialSearch,
  initialCategory,
  initialCategoryName,
  initialCategories,
  initialSortBy,
  initialSortOrder,
}: ProductsDashboardViewProps) {
  const products = initialProducts ?? [];
  const total = initialTotal ?? 0;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateUrl = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const q = updates.q !== undefined ? String(updates.q) : initialSearch;
    const category =
      updates.category !== undefined ? String(updates.category) : initialCategory;
    const sortBy = updates.sortBy ?? initialSortBy;
    const order = updates.order ?? initialSortOrder;
    const page = updates.page ?? initialPage;

    if (q) params.set("q", q);
    if (category) params.set("category", category);
    params.set("sortBy", String(sortBy));
    params.set("order", String(order));
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const debouncedUpdateSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    updateUrl({ q: value, page: 1 });
  }, SEARCH_DEBOUNCE_MS);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedUpdateSearch(value);
  };

  const handleCategoryChange = (slug: string) => {
    updateUrl({ category: slug, page: 1 });
  };

  const handleSortChange = (newSortBy: SortOption, newOrder: SortOrder) => {
    updateUrl({ sortBy: newSortBy, order: newOrder, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
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
              className="flex-1 sm:max-w-md"
            />
            <CategorySelect
              categories={initialCategories}
              value={initialCategory}
              onChange={handleCategoryChange}
              className="sm:w-48"
            />
            <SortSelect
              sortBy={initialSortBy}
              order={initialSortOrder}
              onSortChange={handleSortChange}
              className="sm:w-48"
            />
          </div>
        </div>

        {!isPending && products.length > 0 && (
          <ResultsMeta
            total={total}
            currentCount={products.length}
            searchQuery={initialSearch}
            category={initialCategoryName}
          />
        )}

        {products.length === 0 && !isPending ? (
          <EmptyState />
        ) : (
          <ProductGrid
            products={products}
            loading={isPending}
            onProductClick={handleProductClick}
          />
        )}

        {!isPending && products.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={initialPage}
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
