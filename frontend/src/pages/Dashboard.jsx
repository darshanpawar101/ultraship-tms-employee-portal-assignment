import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditUserDetailsForm } from "@/components/views/EditUserDetailsForm";
import EmployeeTable from "@/components/views/EmployeeTable";
import EmployeeTile from "@/components/views/EmployeeTile";
import { MultiSelectFilter } from "@/components/views/MultiSelectFilter";
import PaginationControls from "@/components/views/PaginationControls.";
import SortSelector from "@/components/views/SortSelector";
import UserDetailModal from "@/components/views/UserDetailModal";
import { DELETE_USER } from "@/graphql/mutations";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation, useQuery } from "@apollo/client/react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GET_ALL_EMPLOYEES,
  GET_ALL_EMPLOYEES_FILTERS,
} from "../graphql/queries";

const itemsPerPage = 12;

export default function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'tile'
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [activeFilters, setActiveFilters] = useState({
    role: [],
    gender: [],
    className: [],
  });

  const [sort, setSort] = useState({});

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const debouncedFilters = useDebounce(activeFilters, 800);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  const [deleteUser] = useMutation(DELETE_USER);

  const {
    data,
    loading,
    error,
    refetch: refetchUsers,
  } = useQuery(GET_ALL_EMPLOYEES, {
    variables: {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        filters: debouncedFilters,
        sort: sort,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const employees = data?.getAllEmployees?.employees || [];
  const paginationInfo = data?.getAllEmployees?.pagination || {};

  const { data: filterData } = useQuery(GET_ALL_EMPLOYEES_FILTERS, {
    fetchPolicy: "cache-and-network",
  });

  const { roles, genders, classNames } = filterData?.getEmployeesFilters || {};

  const roleOptions = roles?.map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  }));

  const genderOptions = genders?.map((gender) => ({
    value: gender,
    label: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
  }));

  const classOptions = classNames?.map((className) => ({
    value: className,
    label: className,
  }));

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= paginationInfo.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filterName, newValues) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: newValues,
    }));
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setIsSheetOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const variables = { userId: user._id };
    await deleteUser({ variables });
    refetchUsers();
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  if (loading)
    return <div className="p-10 text-center">Loading Ecosystem...</div>;
  if (error)
    return <div className="p-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Employee Directory
          </h1>
          <p className="text-zinc-500">Manage and view your team members.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" /> Tiles
          </Button>
          <Button
            variant={viewMode === "tile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("tile")}
            className="gap-2"
          >
            <List className="w-4 h-4" /> List
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex">
          <div>
            <MultiSelectFilter
              options={roleOptions}
              selected={activeFilters.role}
              onSelect={(v) => handleFilterChange("role", v)}
              title="Role"
            />
          </div>

          <div>
            <MultiSelectFilter
              options={genderOptions}
              selected={activeFilters.gender}
              onSelect={(v) => handleFilterChange("gender", v)}
              title="Gender"
            />
          </div>

          <div>
            <MultiSelectFilter
              options={classOptions}
              selected={activeFilters.className}
              onSelect={(v) => handleFilterChange("className", v)}
              title="Class"
            />
          </div>

          <div>
            <SortSelector onSortChange={handleSortChange} sort={sort} />
          </div>
        </div>

        {["ADMIN"].includes(currentUser?.role) && (
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add New User
          </Button>
        )}
      </div>

      <PaginationControls
        pagination={paginationInfo}
        onPageChange={handlePageChange}
      />

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {employees.map((emp) => (
              <EmployeeTile
                key={emp._id}
                employee={emp}
                onSelect={() => setSelectedUser(emp)}
                handleOpenEdit={handleOpenEdit}
                handleDeleteUser={handleDeleteUser}
                currentUserRole={currentUser?.role}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            <EmployeeTable
              employees={employees}
              onSelect={setSelectedUser}
              handleOpenEdit={handleOpenEdit}
              handleDeleteUser={handleDeleteUser}
              currentUserRole={currentUser?.role}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PaginationControls
        pagination={paginationInfo}
        onPageChange={handlePageChange}
      />

      {["ADMIN"].includes(currentUser?.role) && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-[700px] w-full overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {userToEdit
                  ? `Edit User: ${userToEdit.name}`
                  : "Create New User"}
              </SheetTitle>
              <SheetDescription>
                {userToEdit
                  ? "Update employee details, credentials, or role."
                  : "Enter the required details for a new employee profile."}
              </SheetDescription>
            </SheetHeader>
            <div className="pt-6 p-10">
              <EditUserDetailsForm
                user={userToEdit}
                onClose={() => {
                  setSelectedUser(null);
                  setIsSheetOpen(false);
                }}
                refetchUsers={refetchUsers}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={handleOpenEdit}
        currentUserRole={currentUser?.role}
      />
    </div>
  );
}
