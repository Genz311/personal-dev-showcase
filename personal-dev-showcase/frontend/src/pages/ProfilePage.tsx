import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { userService, UpdateProfileData } from '../services/userService';
import UserProfile from '../components/UserProfile';
import ProfileForm from '../components/ProfileForm';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user: authUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: userService.getCurrentUser,
    enabled: !!authUser
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['current-user'], updatedUser);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    }
  });

  if (!authUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading your profile. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    await updateProfileMutation.mutateAsync(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and profile settings
        </p>
      </div>

      {/* Profile Content */}
      {isEditing ? (
        <ProfileForm
          user={user}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditing(false)}
          isLoading={updateProfileMutation.isPending}
        />
      ) : (
        <UserProfile
          user={user}
          isOwnProfile={true}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Account Settings Section */}
      {!isEditing && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Change Email
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-600">••••••••</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Account Status</h3>
                <p className="text-sm text-gray-600">
                  {user.isPublic ? 'Public Profile' : 'Private Profile'}
                </p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                {user.isPublic ? 'Make Private' : 'Make Public'}
              </button>
            </div>
            <div className="pt-4">
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;