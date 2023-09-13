import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppConfig } from "./AppConfig";
import { Suspense } from "react";
// import GlobalLoading from './components/loading/Loading';
import NotFound from "./pages/404";
import NotAuthorized from "./pages/401";
import AuthGuard from "./guard/AuthGuard";
import DashboardCensor from "./layout/censor/DashboardCensor";
import DashBoardReviewer from "./layout/reviewer/DashboardReviewer";
import Index from "./pages/censor/category";
import DashboardAuthUser from "./layout/user/auth/DashboardAuthUser";
import Dashboard from "./pages/censor/dashboard/Dashboard";
import DanhSachActicles from "./pages/censor/articles/ListArticle";
import Texteditor from "./pages/user/create-article/texteditor";
import DashboardGuestUser from "./layout/user/guest/DashboardGuestUser";
import HomeGuestUser from "./pages/user/guest/Home";
import GusetGuard from "./guard/GuestGuard";
import ArticelGuestUser from "./pages/user/guest/articel/ArticelGuestUser";
import ListArticel from "./pages/user/auth/article/ListArticel";
import MyArticle from "./pages/user/my-article/MyArticle";
import MyFavouriteArticle from "./pages/user/my-favourite/MyFavouriteArticle";
import ProfileUser from "./pages/user/profile/ProfileUser";
import Reviewer from "./pages/reviewer/articles/index";
import DetailPage from "./pages/reviewer/articles/detail";
import History from "./pages/user/history/history";
import Trash from "./pages/user/trash/trash";
import Album from "./pages/user/album/Album";
import DetailAlbum from "./pages/user/album/DetailAlbum";
import DetailUserArticle from "./pages/user/auth/article/DetailUserArticle";
import DetaiConsorArticle from "./pages/censor/articles/DetailCenSorArticle";
import DetailMyArticle from "./pages/user/my-article/DetailMyArticle";
import RegistrationPeriod from "./pages/censor/registration-period/registration-period";
import TotalChartUser from "./pages/user/chart/TotalChart";
import TotalChartCensor from "./pages/censor/chart/TotalChart";
import DetailRegistration from "./pages/censor/registration-period/user-registration-period/DetailRegistration";
import DownloadArticle from "./pages/censor/download/download-article";
import GlobalLoading from "./components/global-loading/GlobalLoading";
import DetailArticleGuest from "./pages/user/guest/articel/DetailArticleGuest";
import ApprovedHistory from "./pages/censor/history/History";
import DetaiConsorApprovedArticle from "./pages/censor/history/DetailCenSorApprovedArticle";
import SendArticle from "./pages/censor/download/SendArticle";
import FormSend from "./pages/censor/form-send/formSend";
import DetailArticle from "./pages/censor/articles/DetailArticle";
import Teacher from "./pages/censor/teacher/teacher";
import TeacherRegistration from "./pages/censor/teacher/ModalAdd";
import FullTextSearch from "./pages/user/full-text-search/FullTextSearch";
import DetailTeacher from "./pages/censor/teacher/ModalDetail";
function App() {
  return (
    <div className="App scroll-smooth md:scroll-auto font-sans">
      <BrowserRouter basename={AppConfig.routerBase}>
        <Suspense fallback={<GlobalLoading />}>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/layout-guard-roles" element={<NotAuthorized />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
            {/* Màn censor */}
            <Route
              path="/censor/category"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <Index />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/dashboard"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <Dashboard />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/article"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DanhSachActicles />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/article/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DetaiConsorArticle />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/detail-article/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DetailArticle />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/registration-period"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <RegistrationPeriod />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/cloud-article"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DownloadArticle />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/cloud-article/send-article/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <SendArticle />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/registration-period/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DetailRegistration></DetailRegistration>
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/approved-history"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <ApprovedHistory />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/approved-history/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DetaiConsorApprovedArticle />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/form-send"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <FormSend />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <Teacher />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher/:id"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <DetailTeacher />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher/registration"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <TeacherRegistration />
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            {/* Thống kê */}
            <Route
              path="/censor/chart"
              element={
                <AuthGuard>
                  <DashboardCensor>
                    <TotalChartCensor></TotalChartCensor>
                  </DashboardCensor>
                </AuthGuard>
              }
            />
            {/* Màn user */}
            <Route
              path="/user/create-article"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <Texteditor />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/article"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <ListArticel />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/my-article/update/:id"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <Texteditor />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/search"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <FullTextSearch />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/my-article"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <MyArticle />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/my-favourite-article"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <MyFavouriteArticle />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/profile"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <ProfileUser />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/article/:id"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <DetailUserArticle />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/my-article/:id"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <DetailMyArticle />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/home"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <HomeGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/blog"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <HomeGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/articel"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <ArticelGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/user/history"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <History />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/trash"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <Trash />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/album"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <Album />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            <Route
              path="/user/album/:id"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <DetailAlbum />
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            {/* Màn reviewer */}
            <Route
              path="/reviewer/article"
              element={
                <AuthGuard>
                  <DashBoardReviewer>
                    <Reviewer />
                  </DashBoardReviewer>
                </AuthGuard>
              }
            />
            <Route
              path="/reviewer/article/:id"
              element={
                <AuthGuard>
                  <DashBoardReviewer>
                    <DetailPage />
                  </DashBoardReviewer>
                </AuthGuard>
              }
            />
            <Route
              path="/user/chart"
              element={
                <AuthGuard>
                  <DashboardAuthUser>
                    <TotalChartUser></TotalChartUser>
                  </DashboardAuthUser>
                </AuthGuard>
              }
            />
            {/* User chưa login */}
            <Route
              path="/article/:id"
              element={
                <AuthGuard>
                  <DashboardGuestUser>
                    <DetailArticleGuest />
                  </DashboardGuestUser>
                </AuthGuard>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
