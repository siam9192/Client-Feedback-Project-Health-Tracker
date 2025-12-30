import { ProjectRisk } from "@/types/risk.type";
import { formatEnumLabel, getRiskSeverityColor, getRiskStatusColor } from "@/utils/helpers";

interface Props {
  risk: ProjectRisk;
}

function RiskCard({ risk }: Props) {
  const createdAt = new Date(risk.createdAt);

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg">
      {/* Severity  */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${getRiskSeverityColor(risk.severity)}`}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
            {risk.title}
          </h3>

          {/* Project info */}
          <p className="mt-1 text-xs text-gray-500">
            Project: {risk.project.name} • Status: {formatEnumLabel(risk.project.status)}
          </p>
          <p className="text-xs text-gray-500">Health Score: {risk.project.healthScore ?? "N/A"}</p>

          {/* Owner info  */}
          <p className="mt-1 text-xs text-gray-500">Created By: {risk.employee.name}</p>
        </div>

        {/* Risk badges */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskSeverityColor(
              risk.severity,
            )}`}
          >
            {formatEnumLabel(risk.severity)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskStatusColor(
              risk.status,
            )}`}
          >
            {formatEnumLabel(risk.status)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-100" />

      {/* Body */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">Mitigation Plan</p>
        <p className="text-sm text-gray-600 leading-relaxed">{risk.mitigationPlan}</p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <span>
          Created on{" "}
          <span className="font-medium text-gray-700">
            {createdAt.toLocaleDateString()}, {createdAt.toLocaleTimeString()}
          </span>
        </span>

        {risk.resolvedAt ? (
          <span className="font-medium text-green-600">
            Resolved on {new Date(risk.resolvedAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="italic text-gray-400">Not resolved yet</span>
        )}
      </div>
    </div>
  );
}

export default RiskCard;
