"use client";

import useQuery from "@/hooks/useQuery";
import { getProjectActivityTimelines } from "@/services/api/project.api.service";
import { ActivityTimeline } from "@/types/activity.type";
import { IResponse } from "@/types/response.type";
import { formatTimelineDate, getTotalPages } from "@/utils/helpers";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  onClose: () => void;
}

function ActivitiesDialog({ id, onClose }: Props) {
  const [page, setPage] = useState(1);
  const [timelines, setTimelines] = useState<ActivityTimeline[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<IResponse<ActivityTimeline[]>>(
    `project-activity-timelines-${id}`,
    () => getProjectActivityTimelines(id, { page }),
  );

  const meta = data?.meta;
  useEffect(() => {
    if (data?.data) {
      setTimelines((prev) => {
        const newItems = data.data.filter((item) => !prev.some((t) => t.date === item.date));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || isLoading || !meta) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

    if (isBottom && page < getTotalPages(meta.totalResults, meta.limit)) {
      setPage((p) => p + 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Project Activities</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Empty */}
        {!isLoading && meta?.totalResults === 0 && (
          <p className="text-center text-gray-400 py-10">No activities found.</p>
        )}

        {/* Timeline */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="space-y-6 max-h-[420px] overflow-y-auto pr-2 font-secondary"
        >
          {timelines.map((group, index) => (
            <div key={index}>
              {/* Date */}
              <p className="text-sm font-medium text-gray-500 mb-3">
                {formatTimelineDate(new Date(group.activities[0].createdAt).toLocaleDateString())}
              </p>

              <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                {group.activities.map((activity) => (
                  <div key={activity._id} className="relative">
                    <span className="absolute -left-[9px] top-3 w-3 h-3 bg-indigo-600 rounded-full" />

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">
                          {activity.performedBy?.name ?? "System"}
                        </span>{" "}
                        {activity.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Loading more */}
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          )}
        </div>

        {/* Close buttons */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesDialog;
