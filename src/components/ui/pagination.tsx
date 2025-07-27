import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean; // optionnel, pour désactiver le bouton "Next" si besoin
  className?: string;
};

export function Pagination({ page, onPageChange, hasNext = true, className = "" }: PaginationProps) {
  return (
    <div className={`flex justify-between items-center mt-4 px-5 ${className}`}>
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        variant="outline"
      >
        Previous
      </Button>
      <span>Page {page}</span>
      <Button
        onClick={() => onPageChange(page + 1)}
        variant="outline"
        disabled={!hasNext}
      >
        Next
      </Button>
    </div>
  );
}