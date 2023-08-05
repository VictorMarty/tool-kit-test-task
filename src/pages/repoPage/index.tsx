import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  checkIsLoadingData,
  findRepositoryById,
  getSelectedRepositoryData,
} from "../../entities/repositories";
import { AppDispatch } from "../../app/store/store";
import Card from "../../entities/repositories/ui/Card";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import Spinner from "../../shared/ui/Spinner";

const RepoPage = () => {
  const params = useParams();

  const dispatch = useDispatch<AppDispatch>();

  useScrollToTop();

  const selectedRepository = useSelector(getSelectedRepositoryData);
  const isLoading = useSelector(checkIsLoadingData);

  useEffect(() => {
    if (params.id && selectedRepository?.id !== params.id) {
      dispatch(findRepositoryById(params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      {isLoading && <Spinner />}
      {!isLoading && selectedRepository && (
        <div className="repository-content">
          <div className="repository-owner">
            {selectedRepository.owner.avatarUrl && (
              <img
                width={96}
                height={96}
                src={selectedRepository.owner.avatarUrl}
              />
            )}
            <Link to={selectedRepository.owner.url} target="_blank">
              {selectedRepository.owner.login}
            </Link>
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
            {selectedRepository.description && (
              <span>{selectedRepository.description}</span>
            )}
            {!selectedRepository.description && (
              <span>Описание отсутствует</span>
            )}
          </div>
          <div className="repository-languages">
            <span>Languages</span>
            <ul>
              {selectedRepository.languages.nodes.map((lang) => (
                <li style={{ color: lang.color }}>{lang.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoPage;
