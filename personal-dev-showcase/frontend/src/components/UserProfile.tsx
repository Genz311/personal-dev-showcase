import { User } from '../types';

interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const UserProfile = ({ user, isOwnProfile = false, onEdit }: UserProfileProps) => {
  const socialLinks = [
    { name: 'Website', value: user.website, icon: '🌐' },
    { name: 'GitHub', value: user.github, icon: '⚡' },
    { name: 'Twitter', value: user.twitter, icon: '🐦' },
    { name: 'LinkedIn', value: user.linkedin, icon: '💼' }
  ].filter(link => link.value);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || user.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {(user.name || user.username).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name || user.username}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
            {user.location && (
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </p>
            )}
          </div>
        </div>
        {isOwnProfile && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
          <p className="text-gray-600 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Links</h3>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          })}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;