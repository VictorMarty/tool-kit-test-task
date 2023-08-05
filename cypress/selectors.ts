const selectors = {
  main: {
    input: ".search-input",
    button: "#search-button",
    list: {
      overview: ".list",
      getItemByPosition: (number) => `#card-${number}`,
    },
    pagination: {
      getItemByNumber: (number) => `#page-number-${number}`,
      activePage: ".active-page",
    },
  },
  repo: {
    author: ".repository-owner a",
    languagesList: ".repository-languages ul",
  },
  card: {
    overview: ".card",
    titleLink: ".card-title-link",
    link: ".card-link",
  },
};

export default selectors;
