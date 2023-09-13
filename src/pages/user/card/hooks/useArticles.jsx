// import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
// import { useState, useEffect } from "react";
// import { FullSearchTextAPI } from "../../../../apis/user/auth/full-search-text/full-search-text.api";
// import { useLocation } from "react-router";
// import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
// import { AddArticles } from "../../../../app/reducers/articles/articles.reducer";
// import { AddUser } from "../../../../app/reducers/users/users.reducer";

// const useArticles = (pageNum = 1) => {
//   const [results, setResult] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState({});
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const location = useLocation();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const searchValue = searchParams.get('search');
//     setIsLoading(true);
//     setIsError(false);
//     setError({});
//     const controller = new AbortController();
//     const { signal } = controller;
//     const fetchFullSearch = () => {
//       FullSearchTextAPI.getSearchAll({ page: 0, search: searchValue }).then((response) => {
//         response.data.data.forEach((element) => {
//           console.log(element);
//           if (element.classify === 1) {
//             dispatch(AddArticles(element));
//           } else if (element.classify === 2) {
//             dispatch(AddUser(element));
//           }
//         });
//       });
//     };
//     return () => controller.abort();
//   }, [pageNum]);
//   return { isLoading, isError, error, results, hasNextPage };
// };
// export default useArticles;
