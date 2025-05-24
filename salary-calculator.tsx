"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, DollarSign, Users, TrendingUp } from "lucide-react"

export default function SalaryCalculator() {
  const [totalMoney, setTotalMoney] = useState<number>(8000000000000) // 8 trillion Rand
  const [population, setPopulation] = useState<number>(61000000) // 61 million people
  const [activeTab, setActiveTab] = useState<"calculator" | "comparison">("calculator")

  // Calculate monthly salary
  const monthlySalary = totalMoney / population
  const formattedSalary = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(monthlySalary)

  // Comparison data
  const comparisonData = [
    { label: "Current Top 5%", value: "R134,000", percentage: Math.round((134000 / monthlySalary) * 100) },
    { label: "Current Top 10%", value: "R78,000", percentage: Math.round((78000 / monthlySalary) * 100) },
    { label: "Average Salary", value: "R23,122", percentage: Math.round((23122 / monthlySalary) * 100) },
    { label: "Median Salary", value: "R3,300", percentage: Math.round((3300 / monthlySalary) * 100) },
  ]

  return (
    <motion.div
      className="calculator-container bg-gradient-to-br from-slate-700/90 to-slate-800/90 p-3 sm:p-4 rounded-lg shadow-md border border-slate-700/50 overflow-hidden"
      style={{ borderRadius: "0.5rem !important" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Calculator className="h-5 w-5 text-white" />
        </motion.div>
        <h3 className="font-semibold text-white">Equidistributed Salary Calculator</h3>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 bg-slate-800 rounded-lg p-1">
        <motion.button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
            activeTab === "calculator" ? "bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white" : "text-slate-300"
          }`}
          onClick={() => setActiveTab("calculator")}
          whileHover={{ scale: activeTab !== "calculator" ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          Calculator
        </motion.button>
        <motion.button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
            activeTab === "comparison" ? "bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white" : "text-slate-300"
          }`}
          onClick={() => setActiveTab("comparison")}
          whileHover={{ scale: activeTab !== "comparison" ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          Comparison
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "calculator" ? (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-slate-300">Total Money Pool (Rand)</label>
                <motion.div
                  className="text-xs font-mono bg-slate-800 px-2 py-1 rounded"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  key={totalMoney}
                >
                  {(totalMoney / 1000000000000).toFixed(1)}T
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <input
                  type="range"
                  min={1000000000000} // 1 trillion
                  max={15000000000000} // 15 trillion
                  step={100000000000} // 100 billion
                  value={totalMoney}
                  onChange={(e) => setTotalMoney(Number(e.target.value))}
                  className="w-full p-2 sm:p-3 rounded-md bg-slate-600/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#700936] border border-slate-600"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1T</span>
                <span>15T</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-slate-300">Population</label>
                <motion.div
                  className="text-xs font-mono bg-slate-800 px-2 py-1 rounded"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  key={population}
                >
                  {(population / 1000000).toFixed(1)}M
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <input
                  type="range"
                  min={10000000} // 10 million
                  max={100000000} // 100 million
                  step={1000000} // 1 million
                  value={population}
                  onChange={(e) => setPopulation(Number(e.target.value))}
                  className="w-full p-2 sm:p-3 rounded-md bg-slate-600/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#700936] border border-slate-600"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10M</span>
                <span>100M</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm text-slate-300 mb-1">Monthly Average Salary per Person</div>
              <motion.div
                key={formattedSalary}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-3 rounded-lg text-center"
              >
                <span className="text-xl font-bold text-white">{formattedSalary}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-xs text-slate-300 italic text-center"
              >
                The contract will be continuously redistributing, possibly every second or millisecond, so the amount is
                more of an average.
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 p-3 rounded-lg mb-3">
              <div className="text-sm text-slate-300 mb-2">Equidistributed Salary</div>
              <div className="text-xl font-bold text-white">
                {formattedSalary} <span className="text-sm font-normal">per month</span>
              </div>
            </div>

            <div className="space-y-3">
              {comparisonData.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className="text-sm font-medium text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#700936] to-[#9c1c4e]"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">{item.percentage}% of equidistributed</div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3 p-2 bg-slate-800 rounded-lg">
              <TrendingUp className="h-4 w-4 text-[#9c1c4e]" />
              <p className="text-xs text-slate-300">
                The equidistributed salary is significantly higher than even the top earners in the current system.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
