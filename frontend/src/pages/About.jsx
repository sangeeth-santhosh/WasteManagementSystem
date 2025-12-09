const About = () => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-0 lg:py-1 md:py-10">
      <div className="w-full max-w-8xl rounded-2xl bg-white px-8 sm:px-12 lg:py-10 md:py-14">
        {/* Top content: two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* LEFT SIDE */}
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                EcoPure
              </h1>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-600 font-medium">
                Smart Waste Segregation & Reporting
              </p>
            </div>

            <div className="space-y-5">
              <p className="text-2xl sm:text-3xl font-medium text-slate-800 leading-snug">
                “The greatest threat to our planet is the belief that someone
                else will save it.”
              </p>
              <p className="text-[14px] text-slate-500">
                — Robert Swan, Environmentalist
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-10 text-[15px]">
            {/* Meta info columns */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Project
                </p>
                <p className="text-slate-900 font-medium text-[15px]">
                  MCA Mini Project – EcoPure
                </p>

                <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Course
                </p>
                <p className="text-slate-900 text-[15px]">
                  Master of Computer Applications
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Domain
                </p>
                <p className="text-slate-900 font-medium text-[15px]">
                  Sustainable Waste Management
                </p>

                <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Focus
                </p>
                <p className="text-slate-900 text-[15px]">
                  Clean UI · Secure Access · Real-World Relevance
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-5 pt-2">
              <p className="text-slate-700 leading-relaxed text-[15px]">
                EcoPure is a simple, practical application that helps households
                manage their waste in a cleaner and more responsible way. It
                guides users in identifying the right type of waste and
                encourages everyday habits that reduce clutter and pollution.
              </p>
              <p className="text-slate-700 leading-relaxed text-[15px]">
                By making reporting quick and structured, EcoPure supports
                cleaner surroundings and reduces the strain on community waste
                systems. The project shows how small digital tools can create
                meaningful impact in society through better waste awareness.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex gap-8">
            <span className="hover:text-emerald-700 cursor-default">
              Overview
            </span>
            <span className="hover:text-emerald-700 cursor-default">
              Features
            </span>
            <span className="hover:text-emerald-700 cursor-default">
              Tech Stack
            </span>
          </div>

          <div className="flex gap-6">
            <span className="text-slate-400">EcoPure · MCA Mini Project</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
