import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SquarePlus } from "lucide-react";
import CreateProjectComponent from "./CreateProjectContent";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

export default function CreateProject() {
  return (
    <AlertDialog>
      <TriggerButton />
      <AlertDialogContent className="min-w-[1024px]">
        <AlertDialogTitle />
        <AlertDialogDescription />
        <CreateProjectComponent />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TriggerButton() {
  return (
    <AlertDialogTrigger asChild>
      <div className="px-4 mb-4">
        <div className="h-12 bg-blue-600 flex items-center px-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <SquarePlus className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <span className="text-sm font-semibold text-white">
              Create New Project
            </span>
          </div>
        </div>
      </div>
    </AlertDialogTrigger>
  );
}
