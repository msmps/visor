import { useState, useEffect } from "react";

interface ServerStatus {
  status: string;
  timestamp: string;
  port: number;
}

export default function App() {
  const [count, setCount] = useState(0);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/status");
        if (!response.ok) {
          throw new Error("Failed to fetch server status");
        }
        const data = await response.json();
        setServerStatus(data);
        setError(null);
      } catch (err) {
        setError("Failed to connect to server");
        setServerStatus(null);
      }
    };

    // Fetch immediately and then every 5 seconds
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My CLI Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your CLI application interface
          </p>
        </header>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <button
              onClick={() => setCount(count + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Count is: {count}
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            {error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Server Status</p>
                  <p
                    className={`${
                      serverStatus?.status === "running"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {serverStatus?.status || "Loading..."}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Server Port</p>
                  <p className="text-gray-600">
                    {serverStatus?.port || "Loading..."}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="font-medium">Last Update</p>
                  <p className="text-gray-600">
                    {serverStatus
                      ? new Date(serverStatus.timestamp).toLocaleString()
                      : "Loading..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
