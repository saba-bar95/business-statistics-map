import backEndUrl from "../BackEndUrl";

const fetchRegionData = async (regionID, year) => {
  try {
    const response = await fetch(
      `${backEndUrl}/api/getRegBrunva/${regionID}?year=${year}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.log(error.message);
    return null; // Return null or handle the error as needed
  }
};

export default fetchRegionData;
