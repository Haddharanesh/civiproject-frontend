import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useNavigate } from "react-router-dom"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import API from "../services/api"

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}

// Category options with icons
const categories = [
  { value: "ROAD", label: "🛣️ Road / Pothole", color: "bg-gray-100" },
  { value: "WASTE", label: "🗑️ Garbage / Sanitation", color: "bg-green-100" },
  { value: "ELECTRICITY", label: "⚡ Streetlight / Power", color: "bg-yellow-100" },
  { value: "WATER", label: "💧 Water Leakage", color: "bg-blue-100" },
  { value: "OTHER", label: "📍 Other", color: "bg-purple-100" },
]

const ReportIssue = () => {
  const navigate = useNavigate()
  
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("ROAD")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  // Auto-detect on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setMapKey(prev => prev + 1)
      },
      () => console.log("Location permission denied")
    )
  }, [])

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setMapKey(prev => prev + 1)
      },
      () => setError("📍 Location permission denied. Please select manually.")
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!image) {
      setError("📷 Please upload an image of the issue")
      return
    }

    if (!location) {
      setError("📍 Please select a location on the map")
      return
    }

    if (!description.trim()) {
      setError("📝 Please provide a description")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("description", description)
      formData.append("category", category)
      formData.append("latitude", location.lat)
      formData.append("longitude", location.lng)
      formData.append("image", image)

      const res = await API.post("/complaints", formData)
      const data = res.data

      // Duplicate found → do not create new; redirect to existing complaint
      if (data?.isDuplicate && data?.complaint?.id) {
        setMessage(
          data.voteAdded
            ? "✅ Similar issue already reported nearby. Your support was added. Opening it…"
            : `ℹ️ ${data.message || "You have already supported this complaint."} Opening existing report…`
        )
        setTimeout(() => {
          navigate(`/complaint/${data.complaint.id}`, {
            state: {
              fromDuplicate: true,
              message: data.message,
              voteAdded: data.voteAdded,
            },
          })
        }, 1200)
        return
      }

      setMessage("✅ Issue reported successfully! Redirecting...")
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)

      // Reset form
      setDescription("")
      setCategory("ROAD")
      setImage(null)
      setPreview(null)
      setLocation(null)
      setMapKey(prev => prev + 1)
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.error || detail?.message || "Failed to submit report. Please try again."
      setError(`❌ ${msg}`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              📝
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Report a Civic Issue</h1>
              <p className="text-gray-500 mt-1">Help improve your community by reporting problems</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-emerald-50 rounded-2xl p-4">
            <h3 className="font-semibold text-emerald-700 mb-2">💡 Tips for a good report:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Take a clear photo of the issue</li>
              <li>• Be specific about the location</li>
              <li>• Provide a detailed description</li>
              <li>• Choose the appropriate category</li>
            </ul>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          {/* Success/Error Messages */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="font-medium">{message}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Issue Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      category === cat.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="Describe the issue in detail. Include any relevant information like street name, nearby landmarks, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Photo <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                preview ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
              }`}>
                {preview ? (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-xl shadow-lg" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setPreview(null)
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📷</div>
                    <p className="text-gray-500 text-sm">
                      Click or drag to upload a photo of the issue
                    </p>
                    <p className="text-gray-400 text-xs">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ display: preview ? 'none' : 'block' }}
                />
              </div>
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              
              {/* Location Display */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                  <input
                    type="text"
                    value={location ? location.lat.toFixed(6) : ""}
                    readOnly
                    placeholder="Latitude"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                  <input
                    type="text"
                    value={location ? location.lng.toFixed(6) : ""}
                    readOnly
                    placeholder="Longitude"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              {/* Location Buttons */}
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>🎯</span>
                  Use Current Location
                </button>
                <span className="text-sm text-gray-500 self-center">
                  or click on the map below
                </span>
              </div>

              {/* Map */}
              <div className="h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <MapContainer
                  key={mapKey}
                  center={location ? [location.lat, location.lng] : [11.6643, 78.1460]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setLocation={setLocation} />
                  {location && (
                    <Marker position={[location.lat, location.lng]} />
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-200 shadow-lg ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "🚀 Submit Report"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportIssue

