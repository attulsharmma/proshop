import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  next = page + 1,
  prev = page - 1,
  first = 1,
  last = pages,
}) => {
  return (
    pages > 1 && (
      <Pagination>
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${first}`
                : `/page/${first}`
              : `/admin/productlist/${first}`
          }
        >
          <Pagination.First disabled={!(prev > 0)} />
        </LinkContainer>
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${prev}`
                : `/page/${prev}`
              : `/admin/productlist/${prev}`
          }
        >
          <Pagination.Prev disabled={!(prev > 0)} />
        </LinkContainer>

        {[...Array(pages).keys()].map(x => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${next}`
                : `/page/${next}`
              : `/admin/productlist/${next}`
          }
        >
          <Pagination.Next disabled={next > pages} />
        </LinkContainer>

        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${last}`
                : `/page/${last}`
              : `/admin/productlist/${last}`
          }
        >
          <Pagination.Last disabled={next > pages} />
        </LinkContainer>
      </Pagination>
    )
  );
};

export default Paginate;
