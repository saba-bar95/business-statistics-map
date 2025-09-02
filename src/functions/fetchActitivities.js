const fetchActivities = async (language) => {
  let response;
  if (language === "ge") {
    response = await fetch("http://192.168.1.27:5000/api/activities/gis");
  } else {
    response = await fetch(
      "http://192.168.1.27:5000/api/activities/gis?lang=en"
    );
  }

  const data = await response.json();
  return data;
};

export default fetchActivities;
