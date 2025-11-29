import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

const UserDetailModal = ({
  user,
  isOpen,
  onClose,
  onEdit,
  currentUserRole,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] p-0 overflow-hidden bg-white"
        showCloseButton={false}
      >
        <div className="h-32 bg-gradient-to-r from-zinc-900 to-zinc-700 w-full relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <div className="h-4 w-4">✕</div>
          </Button>
        </div>

        <div className="px-8 pb-8 z-10">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <img
              src={user.avatar}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
            />
            <div className="flex gap-2 mb-2">
              {["ADMIN"].includes(currentUserRole) && (
                <Button onClick={() => onEdit(user)}>Edit Profile</Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-zinc-500">
                  @{user.username} • {user.role}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-zinc-900">
                  Academic Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-lg border">
                    <div className="text-sm text-zinc-500">Class</div>
                    <div className="font-medium">
                      {user.className || "Not Assigned"}
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg border">
                    <div className="text-sm text-zinc-500">Subjects</div>
                    <div className="font-medium">
                      {user.subjects?.length} Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 border rounded-xl shadow-sm">
                <div className="text-sm text-zinc-500 mb-1">Attendance</div>
                <div className="text-3xl font-bold">
                  {user.attendance?.percentage.toFixed(1)}%
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-600 h-1.5 rounded-full"
                    style={{ width: `${user.attendance?.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-zinc-500">
                  Details
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Gender</span>
                    <span className="capitalize">{user.gender}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Age</span>
                    <span>{user.age} Years</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
