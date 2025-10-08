"use client"

import { useEffect, useMemo } from "react"

const CustomizeHamperModal = (props) => {
  const {
    // New-style props (from ProductDetailsPage)
    isOpen,
    onClose,
    product,
    hamperQty,
    updateHamperCount,
    totalSelectedPackets,
    meetsMinPackets,
    minPackets = 10,
    customHamperPrice,
    handleAddCustomHamper,

    // Backward-compat props
    flavors,
    qty,
    setQty,
    perPacketPrice = 20,
    totalSelected,
    onProceed,
  } = props

  // Resolve flavor list from available data
  const flavorList = useMemo(() => {
    if (Array.isArray(flavors) && flavors.length > 0) return flavors
    if (Array.isArray(product?.contents) && product.contents.length > 0) return product.contents.map((c) => c.flavor)
    if (hamperQty && typeof hamperQty === "object") return Object.keys(hamperQty)
    if (qty && typeof qty === "object") return Object.keys(qty)
    return []
  }, [flavors, product, hamperQty, qty])

  const getQty = (flavor) => {
    if (hamperQty) return Number(hamperQty[flavor] || 0)
    if (qty) return Number(qty[flavor] || 0)
    return 0
  }

  const selectedTotal =
    typeof totalSelectedPackets === "number"
      ? totalSelectedPackets
      : typeof totalSelected === "number"
        ? totalSelected
        : flavorList.reduce((s, f) => s + getQty(f), 0)

  const effectivePerPacketPrice = typeof customHamperPrice === "number" ? undefined : perPacketPrice

  const price =
    typeof customHamperPrice === "number" ? customHamperPrice : (effectivePerPacketPrice ?? 20) * selectedTotal

  const meetsMin = typeof meetsMinPackets === "boolean" ? meetsMinPackets : selectedTotal >= minPackets

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (selectedTotal >= minPackets) return

    const deficit = minPackets - selectedTotal
    const firstFlavor = flavorList[0]
    if (!firstFlavor) return

    if (typeof updateHamperCount === "function") {
      for (let i = 0; i < deficit; i++) updateHamperCount(firstFlavor, 1)
    } else if (typeof setQty === "function" && qty) {
      const next = { ...qty }
      next[firstFlavor] = (next[firstFlavor] || 0) + deficit
      setQty(next)
    }
  }, [isOpen, selectedTotal, minPackets, flavorList, updateHamperCount, setQty, qty])

  if (!isOpen) return null

  const increase = (flavor) => {
    if (typeof updateHamperCount === "function") {
      updateHamperCount(flavor, 1)
    } else if (typeof setQty === "function") {
      const next = { ...(qty || {}) }
      next[flavor] = Math.max(0, Number(next[flavor] || 0) + 1)
      setQty(next)
    }
  }

  const decrease = (flavor) => {
    // prevent decreasing below minimum total
    if (selectedTotal <= minPackets) return

    if (typeof updateHamperCount === "function") {
      updateHamperCount(flavor, -1)
    } else if (typeof setQty === "function") {
      const next = { ...(qty || {}) }
      next[flavor] = Math.max(0, Number(next[flavor] || 0) - 1)
      const nextTotal = flavorList.reduce((s, f) => s + Number(f === flavor ? next[f] : getQty(f)), 0)
      if (nextTotal < minPackets) return
      setQty(next)
    }
  }

  const proceed = () => {
    if (!meetsMin) return
    if (typeof handleAddCustomHamper === "function") handleAddCustomHamper()
    else if (typeof onProceed === "function") onProceed()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Customize Hamper"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 transform transition-all duration-300 scale-100 animate-scaleIn">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">🎨 Customize Your Hamper</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select at least {minPackets} packets. Tap + or − to adjust packet counts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border hover:bg-gray-50 text-gray-700 font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-auto pr-1">
          {flavorList.map((flavor) => (
            <div
              key={flavor}
              className="flex items-center justify-between bg-gray-50 rounded-xl border p-3 hover:shadow-sm transition-all duration-200"
            >
              <div className="font-medium text-gray-800">{flavor}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrease(flavor)}
                  disabled={selectedTotal <= minPackets}
                  className={`w-8 h-8 rounded-lg border font-bold ${
                    selectedTotal <= minPackets ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={`Decrease ${flavor}`}
                >
                  −
                </button>
                <div className="w-10 text-center font-semibold text-gray-800">{getQty(flavor)}</div>
                <button
                  type="button"
                  onClick={() => increase(flavor)}
                  className="w-8 h-8 rounded-lg border hover:bg-gray-100 text-gray-600 font-bold"
                  aria-label={`Increase ${flavor}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="text-sm text-gray-700">
            Selected: <span className="font-semibold">{selectedTotal}</span>{" "}
            <span className="text-gray-500">(₹{product?.packetPrice ?? perPacketPrice}/packet)</span>
            <div className="mt-1">
              Total: <span className="font-semibold text-orange-600 text-base">₹{price}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={proceed}
              disabled={!meetsMin}
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                meetsMin
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Proceed to Buy
            </button>
          </div>
        </div>

        {!meetsMin && (
          <p className="text-xs text-gray-500 mt-2">Please select at least {minPackets} packets to proceed.</p>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
      `}</style>
    </div>
  )
}

export default CustomizeHamperModal
