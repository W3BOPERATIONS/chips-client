"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { buildApiUrl } from "../config/api"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""

  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    featured: false,
    bestseller: false,
  })

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts()
  }, [])

  // Apply filters and search when dependencies change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersAndSearch()
    }
  }, [query, sortBy, filters, allProducts])

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("api/products"))
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setAllProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fuzzy search function only for product names
  const fuzzySearch = (productName, searchTerm) => {
    if (!searchTerm.trim()) return true
    
    const cleanName = productName.toLowerCase().replace(/[^a-z0-9]/g, '')
    const cleanSearch = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // If search term is very short, do contains check
    if (cleanSearch.length <= 2) {
      return cleanName.includes(cleanSearch)
    }
    
    // If search term is contained in product name, it's a match
    if (cleanName.includes(cleanSearch)) {
      return true
    }
    
    // Calculate similarity for minor spelling variations
    const calculateSimilarity = (str1, str2) => {
      const longer = str1.length > str2.length ? str1 : str2
      const shorter = str1.length > str2.length ? str2 : str1
      
      if (shorter.length === 0) return 0
      
      let matches = 0
      let searchIndex = 0
      
      for (let i = 0; i < longer.length && searchIndex < shorter.length; i++) {
        if (longer[i] === shorter[searchIndex]) {
          matches++
          searchIndex++
        }
      }
      
      return matches / shorter.length
    }
    
    const similarity = calculateSimilarity(cleanName, cleanSearch)
    
    // Allow matches with 70% or higher similarity for product names only
    return similarity >= 0.7
  }

  const applyFiltersAndSearch = () => {
    let results = [...allProducts]

    // Apply search query with fuzzy matching ONLY on product name
    if (query.trim()) {
      results = results.filter(product => 
        fuzzySearch(product.name, query)
      )
    }

    // Apply category filter
    if (filters.category !== "all") {
      results = results.filter(product => product.category === filters.category)
    }

    // Apply price filters
    if (filters.minPrice) {
      results = results.filter(product => product.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      results = results.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    // Apply featured filter
    if (filters.featured) {
      results = results.filter(product => product.featured)
    }

    // Apply bestseller filter
    if (filters.bestseller) {
      results = results.filter(product => product.bestseller)
    }

    // Apply sorting
    results = sortProducts(results, sortBy)

    setFilteredProducts(results)
  }

  const sortProducts = (products, sortType) => {
    const sorted = [...products]
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default:
        // Default sort: best name matches first
        if (query.trim()) {
          return sorted.sort((a, b) => {
            const aNameMatch = fuzzySearch(a.name, query) ? 1 : 0
            const bNameMatch = fuzzySearch(b.name, query) ? 1 : 0
            return bNameMatch - aNameMatch
          })
        }
        return sorted
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      featured: false,
      bestseller: false,
    })
    setSortBy("default")
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results for "{query}"</h1>
        <p className="text-gray-600">{filteredProducts.length} products found</p>
        {query && filteredProducts.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Showing products with similar names
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters & Sorting</h2>
          <button
            onClick={clearFilters}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="spicy">Spicy</option>
              <option value="sweet">Sweet</option>
              <option value="salty">Salty</option>
              <option value="healthy">Healthy</option>
              <option value="premium">Premium</option>
              <option value="combo">Combo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="default">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange("featured", e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.bestseller}
                  onChange={(e) => handleFilterChange("bestseller", e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm">Bestseller</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {query ? `No products found with name similar to "${query}". Try different keywords or adjust your filters.` : 'No products match the current filters.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr items-stretch">
          {filteredProducts.map((product) => (
            <div key={product._id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage