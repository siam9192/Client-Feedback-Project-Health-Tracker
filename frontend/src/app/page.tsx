import Container from "@/components/layout/Container";
import { BarChart2, MessageCircle, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className=" bg-white">
      <Container>
        <div className="min-h-screen  flex items-center justify-center py-10">
          <div className="text-center max-w-2xl bg-white">
            {/* Heading */}
            <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Project Management Platform
            </h1>

            {/* Title */}
            <h2 className="mt-2 text-2xl md:text-3xl sm:text-4xl font-bold text-gray-900">
              Client Feedback & Project Health Tracker
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed font-secondary">
              Monitor project progress, track risks, and gather client feedback — all in one
              centralized dashboard designed for teams, managers, and clients.
            </p>

            {/* Feature Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="rounded-lg border border-gray-100 p-4 flex flex-col items-center gap-2">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
                <p className="font-semibold">Project Health</p>
                <p className="mt-1 text-gray-500 text-center font-secondary">
                  Track progress, deadlines, and risk levels in real time.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4 flex flex-col items-center gap-2">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                <p className="font-semibold">Client Feedback</p>
                <p className="mt-1 text-gray-500 text-center font-secondary">
                  Collect weekly feedback and identify issues early.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4 flex flex-col items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-600" />
                <p className="font-semibold">Smart Insights</p>
                <p className="mt-1 text-gray-500 text-center font-secondary">
                  Make informed decisions with actionable project insights.
                </p>
              </div>
            </div>

            {/* Login Button */}
            <div className="mt-8">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg
              bg-indigo-600 text-white font-medium text-lg
              hover:bg-indigo-700 transition"
              >
                Login to Dashboard
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
