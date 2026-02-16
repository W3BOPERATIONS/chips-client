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

  // Always show all available flavors for customization
  const flavorList = useMemo(() => {
    // If flavors are explicitly provided, use them
    if (Array.isArray(flavors) && flavors.length > 0) return flavors
    
    // Otherwise, use all available flavors from hamperQty
    if (hamperQty && typeof hamperQty === "object") return Object.keys(hamperQty)
    
    // Fallback to default flavors
    return ["Salty Hungama", "Tomato Chatpata", "Onion Tadka", "Desi Garlic", "Chilli Lemon"]
  }, [flavors, hamperQty])

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

  // REMOVED: Auto-fill to minimum packets when modal opens
  // Now starting with all flavors at 0

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
    const currentQty = getQty(flavor)
    if (currentQty <= 0) return

    if (typeof updateHamperCount === "function") {
      updateHamperCount(flavor, -1)
    } else if (typeof setQty === "function") {
      const next = { ...(qty || {}) }
      next[flavor] = Math.max(0, Number(next[flavor] || 0) - 1)
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
              Select at least {minPackets} packets. Mix and match any flavors you like!
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
          {flavorList.map((flavor) => {
            const flavorStock = product?.flavors?.find(f => f.name === flavor)?.stock || 100
            const isLowStock = flavorStock < 20
            return (
              <div
                key={flavor}
                className={`flex items-center justify-between bg-gray-50 rounded-xl border p-3 hover:shadow-sm transition-all duration-200 ${
                  isLowStock ? "border-red-300 bg-red-50" : ""
                }`}
              >
                <div>
                  <div className="font-medium text-gray-800">{flavor}</div>
                  {isLowStock && flavorStock > 0 && (
                    <div className="text-xs text-red-600 font-semibold mt-1">Only {flavorStock} left!</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrease(flavor)}
                    disabled={getQty(flavor) <= 0}
                    className={`w-8 h-8 rounded-lg border font-bold ${
                      getQty(flavor) <= 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
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
            )
          })}
        </div>

        {/* Summary of Selected Packets */}
        {selectedTotal > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4 mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Your Selection:</p>
            <div className="space-y-1">
              {flavorList.map((flavor) => {
                const qty = getQty(flavor)
                return qty > 0 ? (
                  <div key={flavor} className="text-sm text-gray-700 flex justify-between">
                    <span>{flavor}:</span>
                    <span className="font-semibold">{qty} packets</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="text-sm text-gray-700">
            Selected: <span className="font-semibold">{selectedTotal}</span> packets
            <span className="text-gray-500 ml-1">(₹{product?.packetPrice ?? perPacketPrice}/packet)</span>
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
