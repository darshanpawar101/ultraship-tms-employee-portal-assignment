import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ActionMenu from "./ActionMenu";

const EmployeeTable = ({
  employees,
  onSelect,
  handleOpenEdit,
  handleDeleteUser,
  currentUserRole,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Subjects</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow
              key={emp._id}
              onClick={() => onSelect(emp)}
              className="cursor-pointer hover:bg-zinc-50/50"
            >
              <TableCell className="font-medium flex items-center gap-3">
                <img src={emp.avatar} className="w-8 h-8 rounded-full" />
                {emp.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{emp.role}</Badge>
              </TableCell>
              <TableCell className="text-zinc-500">{emp.username}</TableCell>
              <TableCell className="capitalize">{emp.gender}</TableCell>
              <TableCell>{emp.age || "N/A"}</TableCell>
              <TableCell>{emp.className || "-"}</TableCell>
              <TableCell>
                <div className="w-full bg-zinc-100 rounded-full h-2 w-20">
                  <div
                    className="bg-zinc-900 h-2 rounded-full"
                    style={{ width: `${emp.attendance?.percentage || 0}%` }}
                  ></div>
                </div>
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-xs text-zinc-400">
                {emp.subjects?.join(", ")}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <ActionMenu
                  user={emp}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteUser}
                  currentUserRole={currentUserRole}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
