import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store/store";
import {
  checkIsLoadingData,
  findRepositoriesBySearchString,
  findViewerRepositories,
  getSearchedRepositories,
  getViewerRepositories,
} from "../../entities/repositories";
import { useEffect, useState } from "react";
import Card from "../../entities/repositories/ui/Card";
import { useSearchParams } from "react-router-dom";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import Paginator from "../../shared/ui/Paginator";
import Spinner from "../../shared/ui/Spinner";

const Main = () => {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState(searchParams.get("s") || "");

  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(checkIsLoadingData);
  const viewerRepositories = useSelector(getViewerRepositories);
  const searchedRepositories = useSelector(getSearchedRepositories);

  const repositories = !searchParams.get("s")
    ? viewerRepositories
    : searchedRepositories;

  const totalPages = Math.ceil(repositories.length / 10);
  const activePage =
    searchParams.get("p") && Number(searchParams.get("p"))
      ? Number(searchParams.get("p"))
      : 1;

  const checkIsShowCurrentItem = (index: number) =>
    index >= (activePage - 1) * 10 && index < activePage * 10;

  useEffect(() => {
    if (searchString) {
      dispatch(findRepositoriesBySearchString(searchString));
    } else if (!viewerRepositories.length) {
      dispatch(findViewerRepositories());
    }
  }, []);

  const handleClick = () => {
    setSearchParams(
      new URLSearchParams({
        s: searchString,
      }),
    );
    if (searchString) {
      dispatch(findRepositoriesBySearchString(searchString));
    } else if (!viewerRepositories.length) {
      dispatch(findViewerRepositories());
    }
  };

  const handleChangePage = (pageNumber: number) => {
    const newSearchParams = new URLSearchParams({
      p: String(pageNumber + 1),
    });
    const searchStringSearchParams = searchParams.get("s");

    if (searchStringSearchParams) {
      newSearchParams.append("s", searchStringSearchParams);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="page">
      <header>
        <input
          className="search-input"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button id="search-button" onClick={handleClick}>Поиск</button>
      </header>
      {!isLoading && (
        <>
          <div className="list">
            {!!repositories &&
              !!repositories.length &&
              repositories.map((repo, index) =>
                checkIsShowCurrentItem(index) ? <Card {...repo} testId={index} key={repo.id} /> : null,
              )}
            {!!repositories && !repositories.length && (
              <div className="empty">Репозитории не найдены</div>
            )}
          </div>
          <Paginator
            activePage={activePage}
            onClick={handleChangePage}
            totalPages={totalPages}
          />
        </>
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Main;
