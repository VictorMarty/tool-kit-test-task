import React from "react";

type PaginatorProps = {
  totalPages: number;
  onClick: (pageNumber: number) => void;
  activePage: number;
};

const Paginator = React.memo(
  ({ totalPages, onClick, activePage }: PaginatorProps) => (
    <ul className="pagination">
      {!!totalPages &&
        totalPages > 1 &&
        [...Array(totalPages).keys()].map((pageNumber) => (
          <li>
            <button
              onClick={() => {
                onClick(pageNumber);
              }}
              className={
                pageNumber + 1 === activePage ? "active-page-number" : ""
              }
            >
              {pageNumber + 1}
            </button>
          </li>
        ))}
    </ul>
  ),
);

export default Paginator;
