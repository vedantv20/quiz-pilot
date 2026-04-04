import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Award
} from 'lucide-react';
import { usersApi } from '../api/users';
import BadgeChip from '../components/BadgeChip';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch users with pagination and filters
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', page, searchTerm, roleFilter],
    queryFn: () => usersApi.getAll({ 
      page, 
      limit: 20, 
      search: searchTerm, 
      role: roleFilter === 'all' ? undefined : roleFilter 
    })
  });

  // Change user role mutation
  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => usersApi.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      changeRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;
  const totalUsers = usersData?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">{totalUsers}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {users.filter(u => u.role === 'student').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600 dark:text-green-400">
                {users.filter(u => u.role === 'teacher').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Teachers</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Date
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option>All Time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activity Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option>All Users</option>
                    <option>Active (7 days)</option>
                    <option>Inactive (30+ days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Name A-Z</option>
                    <option>Most Active</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : users.length > 0 ? (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden md:block">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Activity</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>

                {/* Table Body - Desktop */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <UserTableRow
                      key={user._id}
                      user={user}
                      onRoleChange={handleRoleChange}
                      onDelete={handleDeleteUser}
                      isChangingRole={changeRoleMutation.isLoading}
                      isDeleting={deleteUserMutation.isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <UserMobileCard
                    key={user._id}
                    user={user}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteUser}
                    isChangingRole={changeRoleMutation.isLoading}
                    isDeleting={deleteUserMutation.isLoading}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalUsers)} of {totalUsers} users
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                        {page}
                      </span>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Desktop Table Row Component
const UserTableRow = ({ user, onRoleChange, onDelete, isChangingRole, isDeleting }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'teacher': return 'green';
      case 'student': return 'blue';
      default: return 'gray';
    }
  };

  const getActivityStatus = (lastActiveDate) => {
    if (!lastActiveDate) return { text: 'Never', color: 'gray' };
    
    const daysSinceActive = Math.floor((new Date() - new Date(lastActiveDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActive <= 1) return { text: 'Active', color: 'green' };
    if (daysSinceActive <= 7) return { text: `${daysSinceActive}d ago`, color: 'yellow' };
    if (daysSinceActive <= 30) return { text: `${daysSinceActive}d ago`, color: 'orange' };
    return { text: '30+ days', color: 'red' };
  };

  const activity = getActivityStatus(user.lastActiveDate);

  return (
    <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* User Info */}
        <div className="col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="col-span-2">
          <BadgeChip text={user.role} variant={getRoleColor(user.role)} />
        </div>

        {/* Activity */}
        <div className="col-span-2">
          <BadgeChip text={activity.text} variant={activity.color} />
        </div>

        {/* Joined Date */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRoleChange(user._id, user.role === 'student' ? 'teacher' : 'student');
                      }}
                      disabled={isChangingRole}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {user.role === 'student' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      Make {user.role === 'student' ? 'Teacher' : 'Student'}
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onRoleChange(user._id, 'admin');
                        }}
                        disabled={isChangingRole}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Shield className="w-4 h-4" />
                        Make Admin
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(user._id);
                      }}
                      disabled={isDeleting}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Card Component
const UserMobileCard = ({ user, onRoleChange, onDelete, isChangingRole, isDeleting }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'teacher': return 'green';
      case 'student': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <BadgeChip text={user.role} variant={getRoleColor(user.role)} />
            <span className="text-xs text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRoleChange(user._id, user.role === 'student' ? 'teacher' : 'student');
                    }}
                    disabled={isChangingRole}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {user.role === 'student' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    Make {user.role === 'student' ? 'Teacher' : 'Student'}
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRoleChange(user._id, 'admin');
                      }}
                      disabled={isChangingRole}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Shield className="w-4 h-4" />
                      Make Admin
                    </button>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(user._id);
                    }}
                    disabled={isDeleting}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;