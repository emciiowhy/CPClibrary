import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertModal(props: any) {
  const alertType = props.alertType;

  if (!props.openAlert) return null; // Prevents rendering unless open

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-xl flex flex-col gap-4 z-50 px-4">

      {/* Success Alert */}
      {alertType === "success" && (
        <Alert className="flex items-start gap-3 rounded-xl shadow-lg border border-green-300 bg-green-50">
          <CheckCircle2Icon className="h-5 w-5 text-green-600 mt-1" />
          <div>
            <AlertTitle className="font-semibold text-green-700">
              {props.title}
            </AlertTitle>
            <AlertDescription className="text-green-600 text-sm">
              {props.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Error Alert */}
      {alertType === "error" && (
        <Alert
          variant="destructive"
          className="flex items-start gap-3 rounded-xl shadow-lg border border-red-300 bg-red-50"
        >
          <AlertCircleIcon className="h-5 w-5 text-red-600 mt-1" />
          <div>
            <AlertTitle className="font-semibold text-red-700">
              {props.title}
            </AlertTitle>
            <AlertDescription className="text-red-600 text-sm mt-1">
              <p>{props.message}</p>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Info Alert */}
      {alertType === "info" && (
        <Alert className="flex items-center gap-3 rounded-xl shadow-lg border border-blue-300 bg-blue-50 py-3 px-4">
          <PopcornIcon className="h-5 w-5 text-blue-600" />
          <AlertTitle className="font-semibold text-blue-700">
            {props.message}
          </AlertTitle>
        </Alert>
      )}
      
    </div>
  );
}