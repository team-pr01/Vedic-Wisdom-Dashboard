import {
  LayoutDashboard,
  Users,
  BookOpen,
  Headphones,
  Landmark,
  HelpCircle,
  Compass,
  ShoppingBag,
  Star,
  Briefcase,
  Leaf,
  GraduationCap,
  Video,
  Utensils,
  Settings,
  LogOut,
  Siren,
  Newspaper,
  Share2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { IMAGES } from "../../assets";

const Sidebar = () => {
  const pathname = useLocation().pathname;
  const navItems = [
    { path: "/dashboard/home", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/users", label: "Users", icon: Users },
    { path: "/dashboard/books", label: "Books", icon: BookOpen },
    { path: "/dashboard/audio-books", label: "Audio Books", icon: Headphones },
    { path: "/dashboard/temple", label: "Temple", icon: Landmark },
    { path: "/dashboard/quiz", label: "Quiz", icon: HelpCircle },
    { path: "/dashboard/shop", label: "Shop", icon: ShoppingBag },
    { path: "/dashboard/emergency", label: "Emergency", icon: Siren  },
    { path: "/dashboard/news", label: "News", icon: Newspaper },
    { path: "/dashboard/vastu", label: "Vastu", icon: Compass },
    { path: "/dashboard/jyotish", label: "Jyotish", icon: Star },
    { path: "/dashboard/consultancy", label: "Consultancy", icon: Briefcase },
    { path: "/dashboard/ayurveda", label: "Ayurveda", icon: Leaf },
    { path: "/dashboard/course", label: "Course", icon: GraduationCap },
    { path: "/dashboard/video", label: "Video", icon: Video },
    { path: "/dashboard/food", label: "Food", icon: Utensils },
    { path: "/dashboard/referral-list", label: "Referral List", icon: Share2 },
  ];

  return (
    <div className="w-72 h-screen top-0 left-0 bg-white border-r border-neutral-55 flex flex-col font-Inter">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-55">
        <div className="flex items-center space-x-2">
          <img src={IMAGES.logo} alt="" className="w-11" />
          <span className="text-xl font-bold text-neutral-10 mt-2">
            Vedic Wisdom
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-primary text-white"
                    : "text-neutral-20 hover:bg-neutral-50/50"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-45 group-hover:text-neutral-20"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-neutral-20"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings and Logout Section */}
      <div className="p-4 border-t border-neutral-55 space-y-1">
        {/* Settings Link */}
        <Link
          to="/settings"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            pathname === "/settings"
              ? "bg-gradient-primary text-white"
              : "text-neutral-20 hover:bg-neutral-50/50"
          }`}
        >
          <Settings
            size={20}
            className={`transition-colors duration-200 ${
              pathname === "settings"
                ? "text-white"
                : "text-neutral-45 group-hover:text-neutral-20"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              pathname === "settings" ? "text-white" : "text-neutral-20"
            }`}
          >
            Settings
          </span>
          {pathname === "settings" && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            // Handle logout logic here
            console.log("Logout clicked");
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-neutral-20 hover:bg-red-50 group"
        >
          <LogOut
            size={20}
            className="text-neutral-45 group-hover:text-red-500 transition-colors duration-200"
          />
          <span className="text-sm font-medium group-hover:text-red-500 transition-colors duration-200">
            Logout
          </span>
        </button>

        {/* User Profile Summary (Optional) */}
        <div className="mt-4 pt-4 border-t border-neutral-55">
          <div className="flex items-center space-x-3 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-10 truncate">
                Admin User
              </p>
              <p className="text-xs text-neutral-45 truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
