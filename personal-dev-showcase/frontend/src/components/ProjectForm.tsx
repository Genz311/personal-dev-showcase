import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateProjectData, Project } from '../types/project';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import TechStackSelector from './TechStackSelector';
import Toggle from './Toggle';

type ProjectFormData = CreateProjectData;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

const ProjectForm = ({ 
  project, 
  onSubmit, 
  isLoading = false, 
  submitText = 'Create Project' 
}: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
      techStack: [],
      isPublic: true,
    },
  });

  const watchedTechStack = watch('techStack');
  const watchedIsPublic = watch('isPublic');

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        imageUrl: project.imageUrl || '',
        techStack: project.techStack,
        isPublic: project.isPublic,
      });
    }
  }, [project, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    await onSubmit(data);
  };

  const handleTechStackChange = (techStack: string[]) => {
    setValue('techStack', techStack, { shouldValidate: true });
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    setValue('isPublic', isPublic);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <Input
                label="Project Title"
                id="title"
                {...register('title', {
                  required: 'Project title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title must be less than 100 characters',
                  },
                })}
                error={errors.title?.message}
                placeholder="Enter your project title"
              />

              <Textarea
                label="Short Description"
                id="description"
                rows={3}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                  maxLength: {
                    value: 500,
                    message: 'Description must be less than 500 characters',
                  },
                })}
                error={errors.description?.message}
                placeholder="Briefly describe your project"
              />

              <Textarea
                label="Detailed Description (Optional)"
                id="longDescription"
                rows={6}
                {...register('longDescription', {
                  maxLength: {
                    value: 2000,
                    message: 'Detailed description must be less than 2000 characters',
                  },
                })}
                error={errors.longDescription?.message}
                placeholder="Provide more details about your project, features, challenges, etc."
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Links</h3>
            
            <div className="space-y-4">
              <Input
                label="GitHub Repository (Optional)"
                id="githubUrl"
                type="url"
                {...register('githubUrl', {
                  pattern: {
                    value: /^https?:\/\/(www\.)?github\.com\/.+/,
                    message: 'Please enter a valid GitHub URL',
                  },
                })}
                error={errors.githubUrl?.message}
                placeholder="https://github.com/username/repository"
              />

              <Input
                label="Live Demo URL (Optional)"
                id="liveUrl"
                type="url"
                {...register('liveUrl', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL',
                  },
                })}
                error={errors.liveUrl?.message}
                placeholder="https://your-project-demo.com"
              />

              <Input
                label="Project Image URL (Optional)"
                id="imageUrl"
                type="url"
                {...register('imageUrl', {
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                    message: 'Please enter a valid image URL',
                  },
                })}
                error={errors.imageUrl?.message}
                placeholder="https://example.com/project-image.jpg"
              />
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technology Stack</h3>
            <TechStackSelector
              selectedTechStack={watchedTechStack}
              onChange={handleTechStackChange}
              error={errors.techStack?.message}
            />
            <input
              type="hidden"
              {...register('techStack', {
                required: 'Please select at least one technology',
                validate: (value) => 
                  value.length > 0 || 'Please select at least one technology',
              })}
            />
          </div>

          {/* Visibility Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility Settings</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <Toggle
                enabled={watchedIsPublic}
                onChange={handleVisibilityChange}
                label="Make project public"
                description={
                  watchedIsPublic 
                    ? "Your project will be visible to everyone and appear in search results"
                    : "Your project will only be visible to you"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;