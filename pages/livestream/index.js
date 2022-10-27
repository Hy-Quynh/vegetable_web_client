import React, { useState } from "react";
import { useEffect } from "react";
import { getAllLiveStream } from "../../services/live-stream";
import style from "./style.module.scss";
import $ from "jquery";

export default function LiveStreamVideo() {
  const [liveStreamData, setLiveStreamData] = useState({
    video_title: "",
    video_description: "",
    video_link: "",
  });

  const getVideoData = async () => {
    const video = await getAllLiveStream();
    if (video?.data?.payload?.length) {
      setLiveStreamData(video?.data?.payload?.[0]);
    }
  };

  useEffect(() => {
    getVideoData();
  }, []);

  useEffect(() => {
    const el = document.getElementById("iframe"); // where you'd like the html to end up
    el.innerHTML = liveStreamData?.video_link;

    // var iframe = document.getElementById("iframe"),
    //   htmlStr = liveStreamData?.video_link;
    // iframe.src = "data:text/html," + htmlStr;
    // $("#iframe body iframe").css({ width: "100%" });
    // $("#iframe body iframe").css({ height: "500px" });
  }, [liveStreamData]);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Phát trực tuyến
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="/">
                  Trang chủ
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                Phát trực tuyến
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container-xxl py-6">
        <div
          className="section-header text-center mx-auto mb-5 wow fadeInUp"
          data-wow-delay="0.1s"
          style={{ maxWidth: "500px" }}
        >
          <h1 className="display-5 mb-3">LiveStream</h1>
          <p>
            LiveStream sản phẩm mới, chia sẻ kiến thức những kiến thức thú vị
          </p>
        </div>

        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  paddingLeft: "100px",
                  paddingRight: "100px",
                }}
              >
                {liveStreamData?.video_title}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  padding: "20px 100px",
                }}
              >
                {liveStreamData?.video_description}
              </div>
            </div>
            <div
              style={{
                paddingLeft: "100px",
                paddingRight: "100px",
              }}
              id="iframe"
              className={style.videoIframeStream}
            >
              {/* <iframe
                className={style.videoIframeStream}
                id="iframe"
                src="blank:"
                style={{
                  width: "100%",
                  height: "500px",
                  display: "flex",
                  justifyContent: "center",
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
