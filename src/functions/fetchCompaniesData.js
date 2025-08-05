const fetchCompaniesData = async (regionId, legalFormId, signal) => {
  try {
    const baseUrl = "http://192.168.1.27:5000/api/documents";
    const params = new URLSearchParams();

    // Add conditional parameters
    if (regionId && regionId !== 100) {
      params.append("factualAddressRegion", regionId);
    }

    if (legalFormId) {
      params.append("legalForm", legalFormId);
    }

    // Always include these
    params.append("x", "true");
    params.append("y", "true");

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected array but got something else");
    }

    return data;
  } catch (error) {
    console.log("Companies fetch error:", error.message);
    return null;
  }
};

export default fetchCompaniesData;
