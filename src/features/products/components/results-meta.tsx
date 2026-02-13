interface ResultsMetaProps {
  total: number;
  currentCount: number;
  searchQuery?: string;
  category?: string;
}

export function ResultsMeta({ total, currentCount, searchQuery, category }: ResultsMetaProps) {
  const getActiveFilter = () => {
    if (searchQuery) return `for "${searchQuery}"`;
    if (category) return `in ${category}`;
    return '';
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="font-medium">
        Showing {currentCount} of {total} products
      </span>
      {getActiveFilter() && (
        <span className="text-gray-500">{getActiveFilter()}</span>
      )}
    </div>
  );
}
