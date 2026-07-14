import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-gray-800 overflow-hidden">

      {/* HERO */}
      <section className="relative">

        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-300/30 blur-3xl rounded-full"></div>
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-emerald-200/40 blur-3xl rounded-full"></div>

        <div className="container mx-auto max-w-6xl px-6 py-32 text-center relative z-10">
          {/* App Icon */}
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M4 21V7l8-4 8 4v14M9 21V9h6v12"
              />
            </svg>
          </div>


          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Empower Your City with
            <span className="text-emerald-600"> CivicConnect</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Report civic issues, track resolutions, and collaborate with your community
            to build a smarter, cleaner, and safer city.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <span>📝</span>
              Report an Issue
            </Link>

            <Link
              to="/analytics"
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 border border-gray-100"
            >
              <span>📊</span>
              View Analytics
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600">1,200+</div>
              <div className="text-gray-500 text-sm mt-1">Issues Reported</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600">850+</div>
              <div className="text-gray-500 text-sm mt-1">Resolved</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600">5,000+</div>
              <div className="text-gray-500 text-sm mt-1">Community Members</div>
            </div>
          </div>
        </div>
      </section>


      {/* FEATURE CARDS */}
      <section className="pb-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">

          {/* CARD 1 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="h-44 overflow-hidden">
              <img
                src="https://www.niradynamics.com/hubfs/Road-Health---pothole.png?auto=compress&cs=tinysrgb&w=800"
                alt="Report issue"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Report Issues</h3>
              <p className="text-gray-600 text-sm mb-4">
                Easily report problems with photos, location data, and detailed descriptions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
                  Photo uploads
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
                  Location tagging
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
                  Detailed descriptions
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                alt="Track progress"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm mb-4">
                Follow the status of your reports from submission to resolution.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">✓</span>
                  Real-time updates
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">✓</span>
                  Status notifications
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">✓</span>
                  Resolution tracking
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Community voting"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                👍
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community Voting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upvote issues in your area to help prioritize what matters most.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">✓</span>
                  Issue upvoting
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">✓</span>
                  Community prioritization
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">✓</span>
                  Impact visibility
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of citizens who are actively improving their communities through civic engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/analytics"
                className="bg-emerald-700/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700/40 transition-colors border border-emerald-400/30"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home

