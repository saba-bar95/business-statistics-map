const fetchLegalForms = async (language) => {
  let response;
  if (language === "ge") {
    response = await fetch("http://192.168.1.27:5000/api/legal-forms/gis/1");
  } else {
    response = await fetch(
      "http://192.168.1.27:5000/api/legal-forms/gis/1?lang=en"
    );
  }

  const data = await response.json();
  return data;
};

export default fetchLegalForms;
