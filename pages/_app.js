import { useRouter } from "next/router";
import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { parseJSON } from "../utils/common";
import { USER_INFO_KEY } from "../utils/constants";
import '/styles/global.scss';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  const userInfo =
  typeof window !== "undefined"
    ? parseJSON(localStorage.getItem(USER_INFO_KEY))
    : {};

  const placeToGo = () => {
    if ( userInfo?.type !== 'admin' && router?.pathname?.includes('/admin') ){
      router?.push('/login')
    }

  }

  useEffect(() => {
    placeToGo()
  }, [router?.asPath])

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
};
export default MyApp;
