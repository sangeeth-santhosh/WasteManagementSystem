import { useState, useEffect } from "react";
import { wasteService } from "../services/wasteService";
import { zoneService } from "../services/zoneService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owns a Compost Bin?
              </label>
              <select
                value={generatorDetails.hasCompostBin || ""}
                onChange={(e) => handleGeneratorDetailChange("hasCompostBin", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
              <select
                value={generatorDetails.businessType || ""}
                onChange={(e) => handleGeneratorDetailChange("businessType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={generatorDetails.institutionType || ""}
                onChange={(e) => handleGeneratorDetailChange("institutionType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor / Unit</label>
              <input
                type="text"
                value={generatorDetails.floor || ""}
                onChange={(e) => handleGeneratorDetailChange("floor", e.target.value)}
                placeholder="e.g., 3rd Floor, Unit 301"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Are there Central Bins?
              </label>
              <select
                value={generatorDetails.hasCentralBins || ""}
                onChange={(e) => handleGeneratorDetailChange("hasCentralBins", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">Report Waste</p>
        <h1 className="text-2xl font-bold text-gray-900">Report Your Waste</h1>
        <p className="text-gray-600 mt-1">Add quantities (kg) and location details. We'll handle the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Waste Quantities (kg)</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {wasteTypes.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {item.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">kg</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Location Details</h3>
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
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
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Generator Type *</h3>
            <p className="text-sm text-gray-600 mb-4">Who is generating the waste?</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {generatorTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleGeneratorTypeChange(type.value)}
                  className={`px-4 py-2.5 rounded-lg border-2 transition-all duration-150 text-sm font-semibold ${
                    generatorType === type.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {generatorType && (
            <Card className="p-5 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                {generatorTypes.find((t) => t.value === generatorType)?.label} Details
              </h3>
              {getGeneratorFields()}
            </Card>
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
          )}
          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
              ✅ Thanks for reporting! We'll process your request.
            </div>
          )}
        </Card>
      </form>
    </div>
  );
};

export default ReportWaste;
