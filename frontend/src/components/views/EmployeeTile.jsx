import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import ActionMenu from "./ActionMenu";

const EmployeeTile = ({
  employee,
  onSelect,
  handleOpenEdit,
  handleDeleteUser,
  currentUserRole,
}) => {
  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white"
      onClick={onSelect}
    >
      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionMenu
          user={employee}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteUser}
          currentUserRole={currentUserRole}
        />
      </div>

      <div className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="w-20 h-20 rounded-full object-cover border-4 border-zinc-50 shadow-md">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>{employee.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <span
            className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
              employee.attendance?.percentage > 75
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          ></span>
        </div>

        <div>
          <h3 className="font-bold text-lg text-zinc-900">{employee.name}</h3>
          <p className="text-sm text-zinc-500 font-medium">{employee.role}</p>
        </div>

        <div className="flex gap-2 w-full justify-center">
          <Badge variant="secondary" className="bg-zinc-100">
            {employee.gender}
          </Badge>
          <Badge variant="outline">
            {employee.attendance?.percentage.toFixed(0)}% Attn
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeTile;
