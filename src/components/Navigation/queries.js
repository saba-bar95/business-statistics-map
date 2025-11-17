const queries = [
  {
    title_ge: "ბიზნეს სტატისტიკა",
    title_en: "Business Statistics",
    links: function () {
      return [
        {
          href: "menu",
          name_ge: this.title_ge,
          name_en: this.title_en,
        },
        {
          href: "home",
          name_ge: "მაჩვენებელი",
          name_en: "Indicator",
        },
        {
          href: "pie",
          name_ge: "დიაგრამა",
          name_en: "Diagram",
        },
        {
          href: "bar",
          name_ge: "ჰისტოგრამა",
          name_en: "Histogram",
        },
        // {
        //   href: "gis",
        //   name_ge: "მოძებნე ბიზნეს სუბიექტი",
        //   name_en: "Find business entity",
        // },
      ];
    },
  },
  {
    title_ge: "მოსახლეობის 2014 წლის საყოველთაო აღწერა",
    title_en: "Population Census 2014",
    links: function () {
      return [
        {
          href: "menu",
          name_ge: this.title_ge,
          name_en: this.title_en,
        },
        {
          href: "regmun",
          name_ge: "ფენა",
          name_en: "Layer",
        },
        {
          href: "home",
          name_ge: "მაჩვენებელი",
          name_en: "Indicator",
        },
        {
          href: "bar",
          name_ge: "ჰისტოგრამა",
          name_en: "Histogram",
        },
      ];
    },
  },
  {
    title_ge: "სასოფლო-სამეურნეო აღწერა 2014",
    title_en: "Agricultural Census 2014",
    links: function () {
      return [
        {
          href: "menu",
          name_ge: this.title_ge,
          name_en: this.title_en,
        },
        {
          href: "regmun",
          name_ge: "ფენა",
          name_en: "Layer",
        },
        {
          href: "home",
          name_ge: "მაჩვენებელი",
          name_en: "Indicator",
        },
        {
          href: "bar",
          name_ge: "ჰისტოგრამა",
          name_en: "Histogram",
        },
      ];
    },
  },
  {
    title_ge: "ფასების სტატისტიკა",
    title_en: "Consumer Price Index",
    links: function () {
      return [
        {
          href: "menu",
          name_ge: this.title_ge,
          name_en: this.title_en,
        },
        {
          href: "home",
          name_ge: "მაჩვენებელი",
          name_en: "Indicator",
        },
        {
          href: "pie",
          name_ge: "დიაგრამა",
          name_en: "Diagram",
        },
        {
          href: "bar",
          name_ge: "ჰისტოგრამა",
          name_en: "Histogram",
        },
      ];
    },
  },
];

queries.forEach((el) => {
  el.links = el.links.bind(el)();
});

export default queries;
