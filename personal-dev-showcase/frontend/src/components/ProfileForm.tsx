import { useForm } from 'react-hook-form';
import { User } from '../types';
import { UpdateProfileData } from '../services/userService';
import Input from './Input';
import Button from './Button';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProfileForm = ({ user, onSubmit, onCancel, isLoading }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch
  } = useForm<UpdateProfileData>({
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      github: user.github || '',
      twitter: user.twitter || '',
      linkedin: user.linkedin || ''
    }
  });

  const validateUrl = (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL (including http:// or https://)';
    }
  };

  const handleFormSubmit = async (data: UpdateProfileData) => {
    // Only include fields that have been changed
    const changedData: UpdateProfileData = {};
    Object.keys(data).forEach((key) => {
      const fieldKey = key as keyof UpdateProfileData;
      const currentValue = data[fieldKey];
      const originalValue = user[fieldKey as keyof User] || '';
      
      if (currentValue !== originalValue) {
        changedData[fieldKey] = currentValue;
      }
    });

    await onSubmit(changedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              {...register('name', {
                maxLength: {
                  value: 100,
                  message: 'Name must be less than 100 characters'
                }
              })}
              error={errors.name?.message}
              placeholder="Your display name"
            />
            <Input
              label="Location"
              {...register('location', {
                maxLength: {
                  value: 100,
                  message: 'Location must be less than 100 characters'
                }
              })}
              error={errors.location?.message}
              placeholder="City, Country"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              {...register('bio', {
                maxLength: {
                  value: 500,
                  message: 'Bio must be less than 500 characters'
                }
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {watch('bio')?.length || 0}/500 characters
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
          <div className="space-y-4">
            <Input
              label="Website"
              type="url"
              {...register('website', {
                validate: validateUrl
              })}
              error={errors.website?.message}
              placeholder="https://yourwebsite.com"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              }
            />
            <Input
              label="GitHub"
              type="url"
              {...register('github', {
                validate: validateUrl
              })}
              error={errors.github?.message}
              placeholder="https://github.com/yourusername"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              }
            />
            <Input
              label="Twitter"
              type="url"
              {...register('twitter', {
                validate: validateUrl
              })}
              error={errors.twitter?.message}
              placeholder="https://twitter.com/yourusername"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              }
            />
            <Input
              label="LinkedIn"
              type="url"
              {...register('linkedin', {
                validate: validateUrl
              })}
              error={errors.linkedin?.message}
              placeholder="https://linkedin.com/in/yourusername"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              }
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;