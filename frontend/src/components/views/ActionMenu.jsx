import { Edit, Flag, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ActionMenu = ({ user, onEdit, onDelete, currentUserRole }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-full"
      >
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {["ADMIN"].includes(currentUserRole) && (
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Details
        </DropdownMenuItem>
      )}
      <DropdownMenuItem>
        <Flag className="mr-2 h-4 w-4" /> Flag Report
      </DropdownMenuItem>
      {["ADMIN"].includes(currentUserRole) && (
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" onC /> Delete User
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ActionMenu;
