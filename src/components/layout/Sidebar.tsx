import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  BookOpen,
  Award,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { UserRole } from '../../types';
import Button from '../common/Button';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.SUPERVISOR] },
    { to: '/assessments', label: 'Assessments', icon: BookOpen, roles: [UserRole.STUDENT] },
    { to: '/assignments', label: 'Assignments', icon: ClipboardList, roles: [UserRole.SUPERVISOR, UserRole.ADMIN] },
    { to: '/my-assignments', label: 'My Assignments', icon: GraduationCap, roles: [UserRole.STUDENT] },
    { to: '/certificates', label: 'Certificates', icon: Award, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.SUPERVISOR] },
    { to: '/users', label: 'Users', icon: Users, roles: [UserRole.ADMIN] },
    { to: '/questions', label: 'Questions', icon: FileText, roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
    { to: '/settings', label: 'Settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.SUPERVISOR] },
  ];

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Test_School
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden"
            />
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Level: {user.currentLevel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.to)
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              fullWidth
              icon={LogOut}
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        icon={Menu}
        onClick={() => dispatch(toggleSidebar())}
        className="fixed top-4 left-4 z-40 lg:hidden bg-white shadow-md"
      />
    </>
  );
};

export default Sidebar;