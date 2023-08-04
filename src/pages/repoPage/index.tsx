import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom"
import { checkIsLoadingData, findRepositoryById, getSelectedRepositoryData } from "../../entities/repositories";
import { AppDispatch } from "../../app/store";
import reactLogo from "../../assets/react.svg"
import Card from "../../entities/repositories/ui/Card";
import useScrollToTop from "../../shared/hooks/useScrollToTop";


const RepoPage = () => {
    const params = useParams();

    const dispatch = useDispatch<AppDispatch>();

    useScrollToTop();

    const selectedRepository = useSelector(getSelectedRepositoryData);
    const isLoading = useSelector(checkIsLoadingData);

    useEffect(() => {
        if (params.id && selectedRepository?.id !== params.id) {
            dispatch(findRepositoryById(params.id))
        }
    }, []);


    console.log(selectedRepository)


    return (<div className="page">
        {
            isLoading && (
                <div className="wrapper-spinner">
                    <img src={reactLogo} className="spinner" alt="React spinner" />
                </div>
            )
        }
        {
            !isLoading && selectedRepository && (
                <div className="repository-content">
                    <div className="repository-owner">
                        {selectedRepository.owner.avatarUrl && <img width={96} height={96} src={selectedRepository.owner.avatarUrl} />}
                        <Link to={selectedRepository.owner.url} target="_blank">{selectedRepository.owner.login}</Link>
                    </div>
                    <Card
                        id={selectedRepository.id}
                        lastCommitDate={selectedRepository.lastCommitDate}
                        name={selectedRepository.name}
                        stargazerCount={selectedRepository.stargazerCount}
                        withLink={false}
                        url={selectedRepository.url}
                    />
                    <div>
                        {selectedRepository.description && <span>{selectedRepository.description}</span>}
                        {!selectedRepository.description && <span>Описание отсутствует</span>}
                    </div>
                    <div className="repository-languages">
                        <span>Languages</span>
                        <ul>
                            {selectedRepository.languages.nodes.map((lang) => <li style={{ color: lang.color }}>{lang.name}</li>)}
                        </ul>
                    </div>
                </div>

            )
        }
    </div>)
}

export default RepoPage