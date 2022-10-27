import { request } from "../utils/request";

export function getAllLiveStream() {
  return request({
    method: "GET",
    url: `/livestream`,
  });
}

export function createNewLiveStream(liveStreamData) {
  return request({
    method: "POST",
    url: `/livestream`,
    body: {liveStreamData}
  });
}

export function updateLiveStreamData(liveStreamData, liveStreamId) {
  return request({
    method: "PUT",
    url: `/livestream/${liveStreamId}`,
    body: {liveStreamData}
  });
}

export function deleteLiveStream(liveStreamId) {
  return request({
    method: "DELETE",
    url: `/livestream/${liveStreamId}`,
  });
}