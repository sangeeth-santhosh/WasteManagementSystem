import { useState, useEffect } from "react";
import { wasteService } from "../services/wasteService";
import { zoneService } from "../services/zoneService";

const wasteTypes = [
  { key: "wetKg", label: "Wet Waste", color: "bg-green-100 text-green-700" },
  { key: "dryKg", label: "Dry Waste", color: "bg-blue-100 text-blue-700" },
  { key: "plasticKg", label: "Plastic", color: "bg-amber-100 text-amber-700" },
  { key: "eWasteKg", label: "E-Waste", color: "bg-purple-100 text-purple-700" },
];

const generatorTypes = [
  { value: "household", label: "Household" },
  { value: "shop", label: "Shop / Store" },
  { value: "institution", label: "Institution" },
  { value: "office", label: "Office / Corporate" },
  { value: "apartment", label: "Apartment / Gated Community" },
];

const ReportWaste = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [generatorType, setGeneratorType] = useState("");
  const [form, setForm] = useState({
    wetKg: "",
    dryKg: "",
    plasticKg: "",
    eWasteKg: "",
    details: "",
  });
  const [generatorDetails, setGeneratorDetails] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const res = await zoneService.getZones();
      setZones(res.data || res || []);
    } catch (err) {
      console.error("Failed to load zones:", err);
    }
  };

  const selectedZoneData = zones.find((z) => z._id === selectedZone);
  const availablePlaces = selectedZoneData?.places?.filter((p) => p.isActive) || [];

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (submitted) setSubmitted(false);
    if (error) setError("");
  };

  const handleGeneratorTypeChange = (type) => {
    setGeneratorType(type);
    setGeneratorDetails({});
  };

  const handleGeneratorDetailChange = (key, value) => {
    setGeneratorDetails((prev) => ({ ...prev, [key]: value }));
  };

  const getGeneratorFields = () => {
    switch (generatorType) {
      case "household":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                House Number / Door Number
              </label>
              <input
                type="text"
                value={generatorDetails.houseNumber || ""}
                onChange={(e) => handleGeneratorDetailChange("houseNumber", e.target.value)}
                placeholder="e.g., 123, A-5"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                min="1"
                value={generatorDetails.familySize || ""}
                onChange={(e) => handleGeneratorDetailChange("familySize", e.target.value)}
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owns a Compost Bin?
              </label>
              <select
                value={generatorDetails.hasCompostBin || ""}
                onChange={(e) => handleGeneratorDetailChange("hasCompostBin", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        );

      case "shop":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name</label>
              <input
                type="text"
                value={generatorDetails.shopName || ""}
                onChange={(e) => handleGeneratorDetailChange("shopName", e.target.value)}
                placeholder="e.g., ABC Grocery Store"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
              <select
                value={generatorDetails.businessType || ""}
                onChange={(e) => handleGeneratorDetailChange("businessType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select...</option>
                <option value="grocery">Grocery</option>
                <option value="textile">Textile</option>
                <option value="restaurant">Restaurant</option>
                <option value="electronics">Electronics</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approx Daily Customer Count (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={generatorDetails.dailyCustomerEstimate || ""}
                onChange={(e) => handleGeneratorDetailChange("dailyCustomerEstimate", e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );

      case "institution":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution Name
              </label>
              <input
                type="text"
                value={generatorDetails.institutionName || ""}
                onChange={(e) => handleGeneratorDetailChange("institutionName", e.target.value)}
                placeholder="e.g., ABC School"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={generatorDetails.institutionType || ""}
                onChange={(e) => handleGeneratorDetailChange("institutionType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select...</option>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="hospital">Hospital</option>
                <option value="office-building">Office Building</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approx Number of People
              </label>
              <input
                type="number"
                min="0"
                value={generatorDetails.peopleCount || ""}
                onChange={(e) => handleGeneratorDetailChange("peopleCount", e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );

      case "office":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company / Office Name
              </label>
              <input
                type="text"
                value={generatorDetails.officeName || ""}
                onChange={(e) => handleGeneratorDetailChange("officeName", e.target.value)}
                placeholder="e.g., ABC Corporation"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor / Unit</label>
              <input
                type="text"
                value={generatorDetails.floor || ""}
                onChange={(e) => handleGeneratorDetailChange("floor", e.target.value)}
                placeholder="e.g., 3rd Floor, Unit 301"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Count</label>
              <input
                type="number"
                min="0"
                value={generatorDetails.employeeCount || ""}
                onChange={(e) => handleGeneratorDetailChange("employeeCount", e.target.value)}
                placeholder="e.g., 50"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );

      case "apartment":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apartment / Society Name
              </label>
              <input
                type="text"
                value={generatorDetails.apartmentName || ""}
                onChange={(e) => handleGeneratorDetailChange("apartmentName", e.target.value)}
                placeholder="e.g., Green Valley Apartments"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Flats
              </label>
              <input
                type="number"
                min="0"
                value={generatorDetails.flatCount || ""}
                onChange={(e) => handleGeneratorDetailChange("flatCount", e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Are there Central Bins?
              </label>
              <select
                value={generatorDetails.hasCentralBins || ""}
                onChange={(e) => handleGeneratorDetailChange("hasCentralBins", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedZone) {
      setError("Please select a zone");
      setLoading(false);
      return;
    }

    if (!generatorType) {
      setError("Please select a generator type");
      setLoading(false);
      return;
    }

    try {
      const reportData = {
        ...form,
        zoneId: selectedZone,
        placeId: selectedPlace || "",
        generatorType,
        generatorDetails,
        zone: selectedZoneData?.name || "",
        details: form.details || "",
      };

      await wasteService.reportWaste(reportData);
      setSubmitted(true);
      localStorage.setItem("hasNewReport", "true");
      setForm({
        wetKg: "",
        dryKg: "",
        plasticKg: "",
        eWasteKg: "",
        details: "",
      });
      setGeneratorDetails({});
      setSelectedZone("");
      setSelectedPlace("");
      setGeneratorType("");
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Report</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Report household waste</h1>
          <p className="text-gray-600 mt-1">Add quantities (kg) and your zone. We'll handle the rest.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wasteTypes.map((item) => (
            <div key={item.key} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">{item.label}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${item.color}`}>kg</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form[item.key]}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Zone *</label>
              <select
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  setSelectedPlace("");
                }}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Zone...</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Collection Point (Place)
              </label>
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                disabled={!selectedZone}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Place...</option>
                {availablePlaces.map((place) => (
                  <option key={place._id} value={place._id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generator Type * (Who is generating the waste?)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {generatorTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleGeneratorTypeChange(type.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    generatorType === type.value
                      ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {generatorType && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {generatorTypes.find((t) => t.value === generatorType)?.label} Details
              </h3>
              {getGeneratorFields()}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={form.details}
              onChange={(e) => handleChange("details", e.target.value)}
              rows={3}
              placeholder="Any additional information..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit report"}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
          )}
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Thanks for reporting! We'll process your request.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReportWaste;
