import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { useState } from "react";

export default function LastTask() {
  const [tasks] = useState([
    { id: 1, name: "Complete project proposal", date: "2023-06-15" },
    { id: 2, name: "Review pull requests", date: "2023-06-14" },
    { id: 3, name: "Update documentation", date: "2023-06-13" },
  ]);

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CheckSquare className="mr-2" /> Last Completed Tasks
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>{task.name}</span>
            <span className="text-sm text-gray-500">{task.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
