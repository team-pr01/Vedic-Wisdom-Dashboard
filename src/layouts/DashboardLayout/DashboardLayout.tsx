import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import { MessageSquareText } from "lucide-react";

const DashboardLayout = () => {
  const pathname = useLocation().pathname;
  return (
    <div className="flex w-full h-screen bg-background-10 overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col w-full min-w-0">
        <DashboardHeader />

        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden px-3 lg:px-6 py-6`}
        >
          <Outlet />
        </div>
      </div>

      {pathname !== "/dashboard/chat" && (
        <Link
          to="/dashboard/chat"
          className="bg-primary-10 rounded-full text-white size-17 flex items-center justify-center fixed right-5 bottom-5"
        >
          <div className="bg-white size-16 rounded-full flex items-center justify-center">
            <div className="bg-primary-10 rounded-full size-15 flex items-center justify-center">
              <MessageSquareText className="size-7" />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default DashboardLayout;
