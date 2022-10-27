import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="" name="keywords" />
        <meta content="" name="description" />

        <link href="/img/favicon.ico" rel="icon" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Lora:wght@600;700&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />

        <link href="/lib/animate/animate.min.css" rel="stylesheet" />
        <link
          href="/lib/owlcarousel/assets/owl.carousel.min.css"
          rel="stylesheet"
        />

        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        <script src="/lib/owlcarousel/owl.carousel.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="/lib/owlcarousel/owl.carousel.min.js"></Script>
        <Script src="/lib/wow/wow.min.js"></Script>
        <Script src="/js/main.js" strategy="lazyOnload"></Script>
        <Script src="https://code.jquery.com/jquery-3.4.1.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></Script>
        <Script src="/lib/easing/easing.min.js"></Script>
        <Script src="/lib/waypoints/waypoints.min.js"></Script>
        <Script src="/lib/owlcarousel/owl.carousel.min.js"></Script>
      </body>
    </Html>
  );
}
