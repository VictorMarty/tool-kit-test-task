import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { checkIsLoadingData, findRepositoriesBySearchString, findViewerRepositories, getSearchedRepositories, getViewerRepositories } from "../../entities/repositories";
import { useEffect, useState } from "react";
import Card from "../../entities/repositories/ui/Card";
import { useSearchParams } from "react-router-dom";
import reactLogo from "../../assets/react.svg"
import useScrollToTop from "../../shared/hooks/useScrollToTop";

const Main = () => {
    useScrollToTop();
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchString, setSearchString] = useState(searchParams.get("s") || "");

    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector(checkIsLoadingData);
    const viewerRepositories = useSelector(getViewerRepositories);
    const searchedRepositories = useSelector(getSearchedRepositories);

    const repositories = !searchParams.get("s") ? viewerRepositories : searchedRepositories;

    const totalPages = Math.ceil(repositories.length / 10);
    const activePage = searchParams.get("p") && Number(searchParams.get("p")) ? Number(searchParams.get("p")) : 1

    useEffect(() => {
        if (searchString) {
            dispatch(findRepositoriesBySearchString(searchString))
        } else if (!viewerRepositories.length) {
            dispatch(findViewerRepositories())
        }
    }, [])

    const handleClick = () => {
        setSearchParams(new URLSearchParams({
            s: searchString
        }))
        if (searchString) {
            dispatch(findRepositoriesBySearchString(searchString))
        } else if (!viewerRepositories.length) {
            dispatch(findViewerRepositories())
        }

    }

    return (
        <div className="page">
            <header>
                <input
                    className="search-input"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <button
                    onClick={handleClick}
                >Поиск
                </button>
            </header>
            {
                !isLoading && (
                    <>
                        <div className="list">
                            {!!repositories && !!repositories.length && (
                                repositories.map((repo, index) => (
                                    index >= (activePage - 1) * 10 && index < (activePage) * 10 ? <Card {...repo} /> : null
                                ))
                            )}
                        </div>
                        <ul
                            className="pagination"
                        >
                            {!!totalPages && totalPages > 1 && (
                                [...Array(totalPages).keys()].map((pageNumber) => (
                                    <li

                                    >
                                        <button
                                            onClick={() => {
                                                const newSearchParams = new URLSearchParams({
                                                    p: String(pageNumber + 1)
                                                })
                                                const searchStringSearchParams = searchParams.get("s");

                                                if (searchStringSearchParams) {
                                                    newSearchParams.append("s", searchStringSearchParams)
                                                }
                                                setSearchParams(newSearchParams)

                                            }}
                                            className={pageNumber + 1 === activePage ? "active-page-number" : ""}
                                        >
                                            {pageNumber + 1}
                                        </button>

                                    </li>
                                ))
                            )}
                        </ul>
                    </>

                )
            }
            {
                isLoading && (
                    <div className="wrapper-spinner">
                        <img src={reactLogo} className="spinner" alt="React spinner" />
                    </div>
                )
            }
        </div>

    )
}


export default Main;