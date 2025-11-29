import { cn } from "@/lib/utils";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Button } from "../ui/button";
import { Badge, Check, ChevronDown, X } from "lucide-react";

const MultiSelectFilter = ({ options, selected, onSelect, title }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value) => {
    const isSelected = selected.includes(value);
    let newSelection;

    if (isSelected) {
      newSelection = selected.filter((s) => s !== value);
    } else {
      newSelection = [...selected, value];
    }
    onSelect(newSelection);
  };

  const handleClear = () => {
    onSelect([]);
  };

  const selectedCount = selected.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 border-dashed"
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="text-sm font-medium">{title}</span>
            {selectedCount > 0 && (
              <>
                <Badge
                  variant="secondary"
                  className="px-1 font-normal lg:hidden"
                >
                  {selectedCount} selected
                </Badge>
                <div className="hidden space-x-1 lg:flex overflow-hidden">
                  {selectedCount > 2 ? (
                    <Badge variant="secondary" className="px-1 font-normal">
                      {selectedCount} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selected.includes(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="px-1 font-normal truncate max-w-[100px]"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title}...`} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {options?.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {selectedCount > 0 && (
            <>
              <div className="h-px bg-zinc-100" />
              <CommandItem
                onSelect={handleClear}
                className="justify-center text-center"
              >
                <X className="mr-2 h-4 w-4" /> Clear filters
              </CommandItem>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { MultiSelectFilter };
