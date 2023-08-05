import format from "date-fns/format";
import { Repository } from "../../types";
import { Link } from "react-router-dom";

const Card = ({
  id,
  lastCommitDate,
  name,
  stargazerCount,
  url,
  withLink = true,
  testId,
}: Repository & { withLink?: boolean; testId?: string }) => {
  return (
    <div className="card" id={`card-${testId}`}>
      <div className="card-title">
        <Link className={"card-title-link"} to={`/${id}`}>
          {name}
        </Link>
      </div>
      <div className="card-info">
        <span className="card-stars">Stars: {stargazerCount}</span>
        <span className="card-commit">
          Коммит:{" "}
          {lastCommitDate
            ? format(new Date(lastCommitDate), "dd.MM.yyyy в HH:mm")
            : "-"}
        </span>
        {withLink && (
          <Link to={url} target="_blank" className="card-link">
            Ссылка
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;
