import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  GitBranch,
  GitCommit,
  Package,
  XCircle,
} from "lucide-react";

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} className="mr-2" />
            <span>
              Modified: {formatDistanceToNow(project.lastModified)} ago
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <GitBranch size={16} className="mr-2" />
            <span>Branch: {project.gitInfo.branch}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <GitCommit size={16} className="mr-2" />
            <span>Last commit: {project.gitInfo.lastCommit.slice(0, 7)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} className="mr-2" />
            <span>
              Committed: {formatDistanceToNow(project.gitInfo.lastCommitDate)}{" "}
              ago
            </span>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Package size={16} className="mr-2" />
            Dependencies
          </h4>
          <div className="max-h-32 overflow-y-auto">
            {project.dependencies.map((dep) => (
              <div
                key={dep.name}
                className="text-xs text-gray-500 dark:text-gray-400 py-1 flex justify-between items-center"
              >
                <span>{dep.name}</span>
                <div className="flex items-center">
                  <span className="font-mono mr-2">v{dep.version}</span>
                  {dep.isOutdated ? (
                    <XCircle
                      size={16}
                      className="text-red-500"
                      title={`Latest: v${dep.latestVersion}`}
                    />
                  ) : (
                    <CheckCircle
                      size={16}
                      className="text-green-500"
                      title="Up to date"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center"
        >
          View on GitHub
          <ExternalLink size={16} className="ml-2" />
        </a>
      </div>
    </div>
  );
}
