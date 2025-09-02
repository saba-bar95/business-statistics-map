const fetchCompaniesData = async (
  regionId,
  legalFormId,
  activityId,
  signal
) => {
  try {
    const baseUrl = "http://192.168.1.27:5000/api/gis-search";
    const params = new URLSearchParams();

    // Only append regionId if it's defined and not 100
    if (regionId && regionId !== 100) {
      params.append("reg", regionId);
    }

    if (legalFormId) {
      params.append("leg", legalFormId);
    }

    if (activityId) {
      params.append("act", activityId);
    }

    // Build URL
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

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
    console.error("Companies fetch error:", error.message);
    return null;
  }
};

export default fetchCompaniesData;
