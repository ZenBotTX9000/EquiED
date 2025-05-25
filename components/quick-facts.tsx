"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Calculator, TrendingUp, PiggyBank, Lightbulb, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { knowledgeBase } from "@/lib/knowledge-base"

type FactCategory = "salary" | "debt" | "free" | "enterprise" | "education"

export default function QuickFacts({ onSelectFact }: { onSelectFact: (fact: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<FactCategory | null>(null)

  const handleToggle = () => {
    setExpanded(!expanded)
    if (expanded) {
      setSelectedCategory(null)
    }
  }

  const handleCategorySelect = (category: FactCategory) => {
    setSelectedCategory(category)

    // Generate fact text based on category
    let factText = ""
    switch (category) {
      case "salary":
        factText = `💰 **South African Salary Calculation**

Money pool: ${knowledgeBase.southAfricaCalculations.moneySources.estimatedTotal}
Population: ${knowledgeBase.southAfricaCalculations.population}

Monthly average salary: **${knowledgeBase.southAfricaCalculations.monthlySalary}** per person

This is higher than the current top 5% of earners (R134,000 per month)!

_Note: The contract will be continuously redistributing, possibly every second or millisecond, so the amount is more of an average._`
        break
      case "debt":
        factText = `🌍 **South Africa's National Debt Clearance**

Annual import costs: ${knowledgeBase.southAfricaEconomicData.importCosts}
Annual export revenue: ${knowledgeBase.southAfricaEconomicData.exportRevenue}
Annual profit: ${knowledgeBase.southAfricaEconomicData.profit}

National debt: ${knowledgeBase.southAfricaEconomicData.nationalDebt}

Debt clearance time: **${knowledgeBase.southAfricaEconomicData.debtClearanceTime} years**`
        break
      case "free":
        factText = `🆓 **How Products Become Free**

${knowledgeBase.freeProductsExplanation}`
        break
      case "enterprise":
        factText = `🏢 **Enterprise Contribution**

${knowledgeBase.enterpriseContribution.definition}

**Example:**
${knowledgeBase.enterpriseContribution.example}

**Benefit:**
${knowledgeBase.enterpriseContribution.benefit}`
        break
      case "education":
        factText = `🎓 **Education in EDS**

${knowledgeBase.education.overview}

${knowledgeBase.education.accessibility}

**National Interest Steering:**
${knowledgeBase.education.nationalInterest}

**Benefits:**
${knowledgeBase.education.benefits}

This system would expand educational institutes and facilities while making education accessible to everyone through mobile-first technology.`
        break
    }

    onSelectFact(factText)
  }

  return (
    <div
      className="quick-facts-container bg-gradient-to-br from-slate-700/90 to-slate-800/90 p-3 sm:p-4 rounded-lg shadow-md border border-slate-700/50 overflow-hidden mb-4"
      style={{ borderRadius: "0.5rem !important" }}
    >
      <motion.button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 text-white p-3 rounded-corners w-full transition-all shadow-md rounded-button",
          expanded
            ? "bg-gradient-to-r from-[#700936] to-[#9c1c4e]"
            : "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700",
        )}
        whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
        whileTap={{ scale: 0.99 }}
        animate={
          expanded
            ? {
                boxShadow: [
                  "0 4px 12px rgba(112, 9, 54, 0.3)",
                  "0 8px 16px rgba(112, 9, 54, 0.4)",
                  "0 4px 12px rgba(112, 9, 54, 0.3)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: expanded ? Number.POSITIVE_INFINITY : 0,
          repeatType: "reverse",
        }}
      >
        <motion.div
          animate={
            expanded
              ? {
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: expanded ? Number.POSITIVE_INFINITY : 0,
            repeatType: "reverse",
          }}
        >
          <Lightbulb className="h-5 w-5" />
        </motion.div>
        <span className="flex-1 text-left font-medium">Quick Facts</span>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 mt-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <FactButton
                icon={<Calculator className="h-5 w-5" />}
                label="Salary Calculation"
                onClick={() => handleCategorySelect("salary")}
                active={selectedCategory === "salary"}
              />
              <FactButton
                icon={<TrendingUp className="h-5 w-5" />}
                label="Debt Clearance"
                onClick={() => handleCategorySelect("debt")}
                active={selectedCategory === "debt"}
              />
              <FactButton
                icon={<PiggyBank className="h-5 w-5" />}
                label="Free Products"
                onClick={() => handleCategorySelect("free")}
                active={selectedCategory === "free"}
              />
              <FactButton
                icon={<Lightbulb className="h-5 w-5" />}
                label="Enterprise Contribution"
                onClick={() => handleCategorySelect("enterprise")}
                active={selectedCategory === "enterprise"}
              />
              <FactButton
                icon={<GraduationCap className="h-5 w-5" />}
                label="Education"
                onClick={() => handleCategorySelect("education")}
                active={selectedCategory === "education"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FactButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-3 rounded-corners transition-all shadow-md backdrop-blur-sm rounded-button",
        active
          ? "bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white"
          : "bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-white hover:from-slate-600/90 hover:to-slate-700/90 border border-slate-700/50",
      )}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
          },
        },
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        borderColor: active ? "transparent" : "rgba(156, 28, 78, 0.5)",
      }}
      whileTap={{ scale: 0.97 }}
      animate={
        active
          ? {
              boxShadow: [
                "0 4px 12px rgba(112, 9, 54, 0.3)",
                "0 8px 16px rgba(112, 9, 54, 0.4)",
                "0 4px 12px rgba(112, 9, 54, 0.3)",
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: active ? Number.POSITIVE_INFINITY : 0,
        repeatType: "reverse",
      }}
    >
      <motion.div
        animate={
          active
            ? {
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: active ? Number.POSITIVE_INFINITY : 0,
          repeatType: "reverse",
        }}
      >
        {icon}
      </motion.div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  )
}
