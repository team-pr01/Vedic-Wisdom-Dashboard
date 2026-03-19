// StepProgress.tsx
import { Check } from "lucide-react";

interface StepProgressProps {
  steps: { id: number; title: string }[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepId: number) => void;
}

const StepProgress = ({ steps, currentStep, completedSteps, onStepClick }: StepProgressProps) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || step.id < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`flex flex-col items-center relative z-10 ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!isClickable}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-primary text-white ring-4 ring-primary-10/20"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-neutral-50 text-neutral-45"
                }`}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCurrent ? "text-primary-10" : "text-neutral-45"
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}

        {/* Progress Line */}
        <div className="absolute top-4 left-0 h-0.5 bg-neutral-50 -z-10 w-full">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepProgress;