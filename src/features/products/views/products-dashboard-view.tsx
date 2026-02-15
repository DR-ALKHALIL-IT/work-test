"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
const VALID_SORT: SortOption[] = ["title", "price", "rating"];
const VALID_ORDER: SortOrder[] = ["asc", "desc"];

function parseSearchParams(searchParams: URLSearchParams) {
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const sortParam = searchParams.get("sort");
  const sortBy: SortOption = VALID_SORT.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "title";
  const orderParam = searchParams.get("order");
  const sortOrder: SortOrder = VALID_ORDER.includes(orderParam as SortOrder)
    ? (orderParam as SortOrder)
    : "asc";
  const pageNum = parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  return {
    searchQuery: q,
    debouncedSearch: q,
    category: category || undefined,
    sortBy,
    sortOrder,
    currentPage,
  };
}

function buildProductsQueryString(params: {
  q: string;
  category: string | undefined;
  sortBy: SortOption;
  sortOrder: SortOrder;
  page: number;
}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.sortBy !== "title") sp.set("sort", params.sortBy);
  if (params.sortOrder !== "asc") sp.set("order", params.sortOrder);
  if (params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function ProductsDashboardView() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState<string | undefined>(() => searchParams.get("category") ?? undefined);
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const s = searchParams.get("sort");
    return VALID_SORT.includes(s as SortOption) ? (s as SortOption) : "title";
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const o = searchParams.get("order");
    return VALID_ORDER.includes(o as SortOrder) ? (o as SortOrder) : "asc";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref to avoid pushing the same URL again (router.replace can lag, so searchParams might not update immediately)
  const lastPushedQueryRef = useRef<string | null>(null);

  // Sync state from URL only when the query string actually changes (e.g. back/forward)
  const searchParamsString = searchParams.toString();
  useEffect(() => {
    lastPushedQueryRef.current = null; // User navigated (or initial load); allow next URL update
    const parsed = parseSearchParams(searchParams);
    setSearchQuery(parsed.searchQuery);
    setDebouncedSearch(parsed.debouncedSearch);
    setCategory(parsed.category);
    setSortBy(parsed.sortBy);
    setSortOrder(parsed.sortOrder);
    setCurrentPage(parsed.currentPage);
  }, [searchParamsString]); // eslint-disable-line react-hooks/exhaustive-deps -- parseSearchParams reads from searchParams

  const updateUrl = useCallback(
    (params: {
      q: string;
      category: string | undefined;
      sortBy: SortOption;
      sortOrder: SortOrder;
      page: number;
    }) => {
      const query = buildProductsQueryString(params);
      lastPushedQueryRef.current = query || null;
      router.replace(`/products${query}`, { scroll: false });
    },
    [router]
  );

  // Update URL when filters/search/page change. Skip if we already pushed this query (avoids loop when router lags).
  useEffect(() => {
    const desired = buildProductsQueryString({
      q: debouncedSearch,
      category,
      sortBy,
      sortOrder,
      page: currentPage,
    });
    const currentNorm = searchParamsString ? `?${searchParamsString}` : "";
    const alreadyPushed = lastPushedQueryRef.current === (desired || null);
    if (desired !== currentNorm && !alreadyPushed) {
      updateUrl({
        q: debouncedSearch,
        category,
        sortBy,
        sortOrder,
        page: currentPage,
      });
    }
  }, [debouncedSearch, category, sortBy, sortOrder, currentPage, searchParamsString, updateUrl]);

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
