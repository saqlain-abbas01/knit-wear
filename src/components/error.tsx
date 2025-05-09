import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

type ErrorProps = {
  title: string;
  discription: string;
};

const ErrorComponent = ({ title, discription }: ErrorProps) => {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="ml-2">Error loading {title}</AlertTitle>
        <AlertDescription className="ml-2">
          We couldn't load the {discription}. Please try again later or contact
          support if the problem persists.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
    </div>
  );
};

export default ErrorComponent;
