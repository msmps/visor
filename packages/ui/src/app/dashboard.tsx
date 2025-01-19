import ProjectCard from "@/components/ui/project-card.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then((res) => res.json()),
  });

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        All Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          projects?.map((project: any) => (
            <div
              key={project.id}
              onClick={() => navigate(`/explore/${project.id}`)}
              className="cursor-pointer"
            >
              <ProjectCard project={project} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
