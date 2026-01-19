export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Available for work
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Ensuring Quality in
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-600 to-gray-900">
              Digital Products
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            An IT QA, Technical Writer, and Business Analyst who bridges
            technology and business through testing, documentation, and
            web-based solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              View My Work
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-gray-900 font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
