const selectors = {
    main: {
        input: ".search-input",
        button: "#search-button",
        list: {
            overview: ".list",
            getItemByPosition: (number) => `card-${number}`,
        },
        card: {
            title: ".card-title",
            link: ".card-link",
            name: ".card-name",
        },
        pagination: {
            getItemByNumber: (number) => `${number}`,
        }
    },
    repo: {
        name: "",
    }
}

export default selectors