import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  GitBranch,
  GitCommit,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

interface Dependency {
  name: string;
  version: string;
  latestVersion: string;
  isOutdated: boolean;
}

interface GitInfo {
  branch: string;
  lastCommit: string;
  lastCommitDate: Date;
}

interface Project {
  id: string;
  name: string;
  lastModified: Date;
  lastDeployed: Date;
  dependencies: Dependency[];
  gitInfo: GitInfo;
}

export default function Explore() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => fetch(`/api/projects/${id}`).then((res) => res.json()),
  });

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Git Information
            </h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <GitBranch size={18} className="mr-2" />
                <span>Branch: {project.gitInfo.branch}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <GitCommit size={18} className="mr-2" />
                <span>Last commit: {project.gitInfo.lastCommit}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock size={18} className="mr-2" />
                <span>
                  Committed:{" "}
                  {formatDistanceToNow(project.gitInfo.lastCommitDate)} ago
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Project Information
            </h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock size={18} className="mr-2" />
                <span>
                  Last modified: {format(project.lastModified, "PPpp")}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock size={18} className="mr-2" />
                <span>
                  Last deployed: {format(project.lastDeployed, "PPpp")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Dependencies
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="py-2">Package</th>
                  <th className="py-2">Current Version</th>
                  <th className="py-2">Latest Version</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {project.dependencies.map((dep) => (
                  <tr
                    key={dep.name}
                    className="border-t border-gray-200 dark:border-gray-600"
                  >
                    <td className="py-2 text-gray-800 dark:text-gray-200">
                      {dep.name}
                    </td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">
                      {dep.version}
                    </td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">
                      {dep.latestVersion}
                    </td>
                    <td className="py-2">
                      {dep.isOutdated ? (
                        <XCircle
                          size={18}
                          className="text-red-500"
                          title="Outdated"
                        />
                      ) : (
                        <CheckCircle
                          size={18}
                          className="text-green-500"
                          title="Up to date"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View on GitHub
            <ExternalLink size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
