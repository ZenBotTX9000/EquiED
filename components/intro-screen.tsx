"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, ShieldCheck, Users, Calculator, ChevronDown } from "lucide-react"
import { useEffect } from "react"

export default function IntroScreen() {
  // Ensure the intro screen is visible at the top
  useEffect(() => {
    // Force scroll to top when intro screen mounts
    window.scrollTo(0, 0)
  }, [])

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.7,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  // const iconAnimation = { // Define directly in the component for better type inference
  //   animate: {
  //     scale: [1, 1.05, 1],
  //     rotate: [0, 2, -2, 0],
  //     transition: {
  //       duration: 3,
  //       repeat: Number.POSITIVE_INFINITY,
  //       repeatType: "reverse" as const, // Ensure literal type
  //     },
  //   },
  // }

  const shimmerAnimation = {
    animate: {
      background: [
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
        "linear-gradient(90deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 0%)",
      ],
      backgroundSize: ["200% 100%", "200% 100%"],
      backgroundPosition: ["-200% 0", "200% 0"],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  const scrollIndicatorAnimation = {
    animate: {
      y: [0, 10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center space-y-6 py-8 overflow-hidden"
    >
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-4 rounded-full shadow-lg"
        animate={{
          boxShadow: [
            "0 10px 25px -5px rgba(112, 9, 54, 0.3)",
            "0 20px 25px -5px rgba(112, 9, 54, 0.5)",
            "0 10px 25px -5px rgba(112, 9, 54, 0.3)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <motion.div
          animate={{ // Apply animation directly
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
            transition: {
              duration: 3,
              repeat: Infinity, // Using Infinity
              repeatType: "reverse" as const, // Using "as const"
            },
          }}
        >
          <Sparkles className="h-10 w-10 text-white drop-shadow-lg" />
        </motion.div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-2xl md:text-3xl font-bold text-white"
        animate={{
          textShadow: [
            "0 0 8px rgba(255,255,255,0.1)",
            "0 0 16px rgba(255,255,255,0.2)",
            "0 0 8px rgba(255,255,255,0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        Sawubona! Molo! Hallo! Hello! Dumela!
      </motion.h1>

      <motion.h2
        variants={itemVariants}
        className="text-xl md:text-2xl font-bold text-white mt-2 relative overflow-hidden"
      >
        <span>Welcome to the Equidistributed Salary Aide</span>
        <motion.div className="absolute inset-0 pointer-events-none" {...shimmerAnimation} />
      </motion.h2>

      <motion.p variants={itemVariants} className="text-slate-300 max-w-md leading-relaxed">
        Learn about a theoretical economic system where a nation's monetary resources are equally distributed to all
        citizens via smart contracts and blockchain.
      </motion.p>

      {/* South African Calculation Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-700 to-slate-800 p-5 rounded-lg w-full max-w-md border-2 border-[#700936] shadow-xl relative overflow-hidden"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatDelay: 1,
          }}
        />

        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full shadow-md"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Calculator className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white">South African Calculation</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left mb-4">
          <motion.div
            className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-md"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(30, 41, 59, 0.9)" }}
          >
            <div className="text-xs text-slate-400">Money Pool</div>
            <div className="text-white font-medium">8 trillion Rand</div>
          </motion.div>

          <motion.div
            className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-md"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(30, 41, 59, 0.9)" }}
          >
            <div className="text-xs text-slate-400">Population</div>
            <div className="text-white font-medium">61 million people</div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-4 rounded-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          animate={{
            boxShadow: [
              "0 4px 12px rgba(112, 9, 54, 0.3)",
              "0 8px 16px rgba(112, 9, 54, 0.4)",
              "0 4px 12px rgba(112, 9, 54, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="text-slate-200 mb-1">Monthly Average Salary per Person:</div>
          <motion.div
            className="text-3xl font-bold text-white"
            animate={{
              textShadow: [
                "0 0 8px rgba(255,255,255,0.2)",
                "0 0 16px rgba(255,255,255,0.4)",
                "0 0 8px rgba(255,255,255,0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            R135,000
          </motion.div>
          <div className="text-sm text-slate-200 mt-1">Higher than the top 5% of current earners (R134,000)</div>
        </motion.div>

        <div className="mt-3 text-xs text-slate-300 italic">
          The contract will be continuously redistributing, possibly every second or millisecond, so the amount is more
          of an average.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <FeatureCard
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          title="Economic Equality"
          description="Discover how equal distribution can eliminate poverty and reduce crime."
          delay={0.1}
        />
        <FeatureCard
          icon={<ShieldCheck className="h-6 w-6 text-white" />}
          title="Blockchain Security"
          description="Learn how smart contracts ensure transparency and prevent corruption."
          delay={0.2}
        />
        <FeatureCard
          icon={<Users className="h-6 w-6 text-white" />}
          title="Social Benefits"
          description="Explore improved well-being, education, and healthcare for all citizens."
          delay={0.3}
        />
      </div>

      <motion.p
        variants={itemVariants}
        className="text-slate-400 text-sm bg-slate-800/50 px-4 py-2 rounded-full shadow-inner"
      >
        Ask me anything about the Equidistributed Salary model!
      </motion.p>

      <motion.div variants={itemVariants} className="text-slate-400 mt-4" {...scrollIndicatorAnimation}>
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </motion.div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay + 0.5,
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(156, 28, 78, 0.5)",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto shadow-md"
        whileHover={{ scale: 1.1, rotate: 5 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: delay,
        }}
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </motion.div>
  )
}
