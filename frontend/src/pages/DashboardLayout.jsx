import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, subItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => subItems && setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {label}
        </div>
        {subItems && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && subItems && (
        <div className="pl-11 pr-2 space-y-1 mt-1">
          {subItems.map((item, idx) => (
            <div
              key={idx}
              className="p-2 text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer rounded-md hover:bg-zinc-50"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-zinc-50/50">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 font-bold text-xl">Ultraship</div>
              <div className="px-4 space-y-2">
                <SidebarItem
                  icon={Users}
                  label="Employees"
                  subItems={["Directory", "Attendance", "Performance"]}
                />
                <SidebarItem icon={Settings} label="Settings" />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center gap-2 font-bold text-xl mr-8">
            <LayoutGrid className="w-6 h-6 text-primary" /> Ultraship
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a href="#" className="text-zinc-900">
              Dashboard
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors">
              Team
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors">
              Projects
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors">
              Reports
            </a>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon" onClick={handleLogOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
