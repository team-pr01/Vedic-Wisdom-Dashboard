/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../../../assets";

interface LogoLoaderProps {
  isLoading?: boolean;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

const LogoLoader = ({ 
  isLoading = true, 
  showProgress = true,
  size = "md"
}: LogoLoaderProps) => {
  const sizeClasses = {
    sm: "w-16",
    md: "w-24",
    lg: "w-32"
  };

  const containerVariants:any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const logoVariants:any = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const progressVariants:any = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  const lineVariants:any = {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        x: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Subtle background glow */}
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Logo with subtle pulse */}
            <motion.div
              variants={logoVariants}
              className="relative"
            >
              <motion.img 
                src={IMAGES.logo} 
                alt="Loading..." 
                className={`${sizeClasses[size]} object-contain`}
                animate={{
                  filter: ["brightness(1)", "brightness(1.05)", "brightness(1)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Shimmer effect overlay */}
            <motion.div
              variants={lineVariants}
              animate="animate"
              className="absolute inset-0 overflow-hidden rounded-lg"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
              }}
            />
          </div>

          {/* Progress bar (optional) */}
          {showProgress && (
            <div className="mt-8 w-48 space-y-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  className="h-full bg-gradient-primary"
                />
              </div>
              <motion.p
                className="text-center text-sm text-gray-500"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading...
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoLoader;