import './style.sass';

import cn from 'classnames';

import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';

const setPaginationList = (page, count) => {
  if (count === 1) {
    return [];
  }

  if (count < 6) {
    return Array(count)
      .fill(1)
      .map((_item, index) => index + 1);
  }

  if (page === 1) {
    return [1, 2, 3, '...', count];
  }

  if (page === 2) {
    return [1, 2, 3, 4, '...', count];
  }

  if (page === 3) {
    return [1, 2, 3, 4, 5, '...', count];
  }

  if (page === 4) {
    return [1, 2, 3, 4, 5, 6, '...', count];
  }

  if (page >= 4 && page < count - 2) {
    return [
      1,
      '...',
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
      '...',
      count,
    ];
  }

  return [1, '...', count - 3, count - 2, count - 1, count];
};

export const Pagination = ({ perPage, total, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(total / perPage);

  const paginationList = setPaginationList(currentPage, pagesCount);

  return (
    paginationList.length > 0 && (
      <nav className="pagination__container">
        <ul className="pagination__list">
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            isPrev
          />
          {paginationList.map((item, index) => (
            <PaginationNumber
              key={index}
              value={item}
              onClick={() => onPageChange(item)}
              isSelected={currentPage === item}
              isDisabled={item === '...'}
            />
          ))}
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === pagesCount}
          />
        </ul>
      </nav>
    )
  );
};

const PaginationNumber = ({ isSelected, value, onClick, isDisabled }) => {
  return (
    <PaginationElementContainer>
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={cn('pagination__button', {
          pagination__button_selected: isSelected,
        })}
      >
        {value}
      </button>
    </PaginationElementContainer>
  );
};

const PaginationButton = ({ onClick, isDisabled, isPrev }) => {
  return (
    <PaginationElementContainer>
      <button
        className="pagination__button"
        onClick={onClick}
        type="button"
        disabled={isDisabled}
      >
        <ChevronIcon
          className={cn('pagination__button_icon', {
            arrow_left: isPrev,
          })}
        />
      </button>
    </PaginationElementContainer>
  );
};

const PaginationElementContainer = ({ children }) => (
  <li className="pagination__item">{children}</li>
);
