interface ResultsMetaProps {
  total: number;
  currentCount: number;
  searchQuery?: string;
  category?: string;
}

export function ResultsMeta({ total, currentCount, searchQuery, category }: ResultsMetaProps) {
  const getActiveFilter = () => {
    if (searchQuery) return `for "${searchQuery}"`;
    if (category) {
      const name = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
      return `in ${name}`;
    }
    return '';
  };

  return (
    <div className="flex items-center gap-2 text-sm text-foreground">
      <span className="font-medium">
        Showing {currentCount} of {total} products
      </span>
      {getActiveFilter() && (
        <span className="text-muted-foreground">{getActiveFilter()}</span>
      )}
    </div>
  );
}
