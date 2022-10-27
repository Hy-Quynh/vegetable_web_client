import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAllUserHaveChat } from "../../../services/chat";
import SearchIcon from "@mui/icons-material/Search";
import { debounce, Divider } from "@mui/material";
import { getAllUser } from "../../../services/user";

export default function ListUserHaveChat(props) {
  const [listUser, setListUser] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const searchText = useRef("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);

  const getListUserHaveChat = async () => {
    const response = await getAllUserHaveChat();
    if (response?.data?.payload?.length) {
      setListUser(response?.data?.payload);
    }
  };

  const searchData = async (keyWord) => {
    if (keyWord?.length) {
      const searchList = await getAllUser(
        "user",
        undefined,
        undefined,
        undefined,
        keyWord?.trim()
      );
      if (searchList?.data?.success) {
        setSearchList(searchList?.data?.payload?.user);
      }
    } else {
      setSearchList([]);
    }
  };

  useEffect(() => {
    getListUserHaveChat();
  }, []);

  const debounceSearch = useCallback(
    debounce(() => {
      searchData(searchText.current);
    }, 200),
    []
  );

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflowY: "auto",
      }}
    >
      <div className="homeSearchBar">
        <div style={{ position: "relative" }}>
          <div className="search" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="searchTerm"
              placeholder="Nhập tên khách hàng muốn tìm kiếm tại đây?"
              onChange={(event) => (searchText.current = event.target.value)}
              onKeyUp={(event) => {
                if (event?.code === "Backspace") {
                  debounceSearch();
                }
              }}
              style={{ width: "80%" }}
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
              }}
            />
            <button
              type="submit"
              className="searchButton"
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
                searchData(searchText.current);
              }}
            >
              <SearchIcon />
            </button>
          </div>
          {(searchList?.length && isComponentVisible && (
            <ul
              ref={ref}
              style={{
                maxHeight: "300px",
                overflow: "auto",
                background: "white",
                position: "absolute",
                width: "90%",
                zIndex: 50,
                padding: "10px",
                borderBottom: "1px solid rgb(44, 206, 244)",
                borderLeft: "1px solid rgb(44, 206, 244)",
                borderRight: "1px solid rgb(44, 206, 244)",
                listStyleType: "none",
              }}
            >
              {searchList?.map((item, index) => {
                return (
                  <>
                    <li
                      key={`search-list-item-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const checkUser = listUser?.find(
                          (it) => it?.user_id == item?.user_id
                        );
                        if (!checkUser?.user_id) {
                          const ur = [...listUser];
                          ur?.push(item);
                          setListUser(ur);
                        }
                        props.changeUserSelected(item);
                        setUserSelected(item?.user_id);
                        setIsComponentVisible(false);
                      }}
                    >
                      {item?.first_name + item?.last_name}
                    </li>
                    {index < searchList?.length - 1 && (
                      <Divider
                        sx={{
                          my: "10px",
                          border: "1px solid rgb(44, 206, 244)",
                        }}
                      />
                    )}
                  </>
                );
              })}
            </ul>
          )) ||
            ""}
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        {listUser?.map((item, index) => {
          return (
            <div
              key={`user-chat-item-${index}`}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "10px 5px",
                cursor: "pointer",
                background: item?.user_id === userSelected ? "#F7F6DC" : "",
              }}
              onClick={() => {
                if (item?.user_id !== userSelected) {
                  props.changeUserSelected(item);
                  setUserSelected(item?.user_id);
                }
              }}
            >
              <div>
                <Image
                  src="/img/user_placeholder.png"
                  alt="user-placeholder-image"
                  width={30}
                  height={30}
                />
              </div>
              <div style={{ marginLeft: "10px" }}>
                {item?.last_name + " " + item?.first_name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
