import { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon,
  Sun
} from "lucide-react";

interface DashboardHeaderProps {
  pageTitle?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
}

const DashboardHeader = ({ 
  pageTitle = "Dashboard",
  userName = "Admin User",
  userEmail = "admin@example.com",
  userAvatar,
  notificationCount = 3,
  onMenuClick,
  onSearch 
}: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format date
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Sample notifications
  const notifications = [
    { id: 1, title: "New user registered", time: "5 min ago", read: false },
    { id: 2, title: "New book added", time: "1 hour ago", read: false },
    { id: 3, title: "Server update completed", time: "2 hours ago", read: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-neutral-55 px-6 py-4 font-Inter">
      <div className="flex items-center justify-between">
        {/* Left Section - Menu Toggle and Page Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle - Hidden on PC but keeping for flexibility */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
          >
            <Menu size={20} className="text-neutral-20" />
          </button>
          
          {/* Page Title and Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-neutral-10">
              {pageTitle}
            </h1>
            <p className="text-sm text-neutral-45 font-Roboto">
              Welcome back, {userName.split(' ')[0]}! 👋
            </p>
          </div>
        </div>

        {/* Right Section - All Actions */}
        <div className="flex items-center space-x-4">
          {/* Date Display */}
          <div className="hidden lg:block text-sm text-neutral-45 font-Roboto border-r border-neutral-55 pr-4">
            {formattedDate}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-neutral-50 rounded-lg text-sm text-neutral-10 placeholder-neutral-55 focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-45"
            />
          </form>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-200 relative"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-neutral-20" />
            ) : (
              <Moon size={20} className="text-neutral-20" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-200 relative"
            >
              <Bell size={20} className="text-neutral-20" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-primary text-white text-xs flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-50 z-40">
                  <div className="p-4 border-b border-neutral-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-10">Notifications</h3>
                      <button className="text-sm text-primary-10 hover:text-primary-10/80">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-neutral-50 hover:bg-neutral-50/50 cursor-pointer transition-colors duration-200 ${
                          !notification.read ? 'bg-primary-10/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${
                            !notification.read ? 'bg-gradient-primary' : 'bg-neutral-45'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-10">
                              {notification.title}
                            </p>
                            <p className="text-xs text-neutral-45 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-neutral-50">
                    <button className="text-sm text-primary-10 hover:text-primary-10/80">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-neutral-10">{userName}</p>
                <p className="text-xs text-neutral-45">{userEmail}</p>
              </div>
              <ChevronDown size={16} className="text-neutral-45 hidden lg:block" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-50 z-40">
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-10 hover:bg-neutral-50 flex items-center space-x-2">
                      <User size={16} className="text-neutral-45" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-10 hover:bg-neutral-50 flex items-center space-x-2">
                      <Settings size={16} className="text-neutral-45" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-10 hover:bg-neutral-50 flex items-center space-x-2">
                      <HelpCircle size={16} className="text-neutral-45" />
                      <span>Help</span>
                    </button>
                    <div className="border-t border-neutral-50 my-1"></div>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="mt-4 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-50 rounded-lg text-sm text-neutral-10 placeholder-neutral-55 focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto"
          />
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-45"
          />
        </form>
      </div>
    </header>
  );
};

export default DashboardHeader;