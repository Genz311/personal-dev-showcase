import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 lg:py-20">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
          Showcase Your Developer Projects
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Share your personal projects with the developer community. Connect with other developers,
          get feedback, and discover inspiring projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Browse Projects
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center space-y-4">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Detailed Project Profiles</h3>
          <p className="text-gray-600">
            Create comprehensive profiles for your projects with descriptions, tech stacks, and live
            demos.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Smart Search & Discovery</h3>
          <p className="text-gray-600">
            Find projects by technology stack, keywords, or browse by categories and developers.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Developer Community</h3>
          <p className="text-gray-600">
            Connect with other developers, share feedback, and build your professional network.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 rounded-lg p-8 lg:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Share Your Work?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of developers showcasing their projects and building connections.
        </p>
        <Link
          to="/register"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          Create Your Free Account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;