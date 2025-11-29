import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const SortSelector = ({ sort, onSortChange }) => {
  const [activeSort, setActiveSort] = useState({});

  useEffect(() => {
    if (sort && Object.keys(sort).length !== 0) {
      setActiveSort(sort);
    }
  }, [sort]);

  const sortFields = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "className", label: "Class Name" },
    { key: "attendance", label: "Attendance" },
  ];

  const handleSort = (field) => {
    let newSort = { ...activeSort };

    if (newSort[field] === undefined) {
      newSort = { [field]: 1 };
    } else if (newSort[field] === 1) {
      newSort = { [field]: -1 };
    } else {
      newSort = {};
    }

    setActiveSort(newSort);
    onSortChange(newSort);
  };

  const getSortIcon = (field) => {
    if (activeSort[field] === 1) return <ArrowUp className="w-4 h-4" />;
    if (activeSort[field] === -1) return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  const getActiveSortLabel = () => {
    const activeField = Object.keys(activeSort)[0];
    if (!activeField) return "Sort by";

    const field = sortFields.find((f) => f.key === activeField);
    const direction = activeSort[activeField] === 1 ? "↑" : "↓";
    return `${field.label} ${direction}`;
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="w-4 h-4" />
            {getActiveSortLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortFields.map((field) => (
            <DropdownMenuItem
              key={field.key}
              onClick={() => handleSort(field.key)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{field.label}</span>
              {getSortIcon(field.key)}
            </DropdownMenuItem>
          ))}
          {Object.keys(activeSort).length > 0 && (
            <>
              <div className="border-t my-1" />
              <DropdownMenuItem
                onClick={() => {
                  setActiveSort({});
                  onSortChange({});
                }}
                className="text-red-600 cursor-pointer"
              >
                Clear Sort
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortSelector;
