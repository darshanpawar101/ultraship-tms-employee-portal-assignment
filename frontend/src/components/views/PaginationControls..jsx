import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const PaginationControls = ({ pagination, onPageChange }) => {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } =
    pagination;

  if (!total) return null;

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
      <div className="text-sm font-medium text-zinc-600">
        Showing <span className="font-semibold">{startRange}</span> to{" "}
        <span className="font-semibold">{endRange}</span> of{" "}
        <span className="font-semibold">{total}</span> results
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        <div className="hidden sm:block text-sm font-semibold text-zinc-900 px-3 py-1 border rounded-md">
          Page {page} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
