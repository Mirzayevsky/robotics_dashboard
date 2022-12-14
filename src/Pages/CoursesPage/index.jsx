import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  getAllCourses,
  deleteCourse,
} from "../../Redux/features/courses/coursesAction";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { LinkHandler } from "../../hooks/Linker";
import { Pagination } from "antd";
import { Input } from "antd";
import { ReactComponent as EditSvg } from "../../Assets/assets/main/edit.svg";
import { ReactComponent as DeleteSvg } from "../../Assets/assets/main/udalit.svg";
import { ReactComponent as ArrowRight } from "../../Assets/assets/main/Arrow - Right.svg";
import { ReactComponent as EyeSvg } from "../../Assets/assets/main/eye.svg";
import {
  Table,
  TableWrapper,
  TBody,
  TD,
  TH,
  THead,
  TRow,
  EditBtn,
  DeleteBtn,
  Status,
} from "../../Components/styles/styles";
import AddOrderDrawer from "../../Components/AddOrderDrawer";
import EditOrderDrawer from "../../Components/EditOrderDrawer";
import { ActionBtn, SidePage } from "../../Components/styles";
import Loading from "../../Components/Loader";
import ErrorBox from "../../Components/errorBox";
import EmptyBox from "../../Components/emptyBox";
import {
  OrdersTitle,
  CoursePageWrapper,
  Btn,
  SearchWrapper,
  Header,
  Title,
} from "./style";
import SearchTable from "../../Components/SearchOrderTable";

const Courses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState({ item: {}, toggle: false });
  const { data, loading, error } = useSelector((state) => state.course);
  const [dataSource, setDataSource] = useState(data);
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { Search } = Input;
  console.log(data);

  const [page, setPage] = useState(0);
  const [postPerPage, setPostPerPage] = useState(10);
  const indexOfLastPage = page + postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = data?.slice(indexOfFirstPage, indexOfLastPage);

  const deleteItem = (id) => {
    dispatch(deleteCourse(id));
  };

  const onSearch = (e) => {
    setQuery(e.target.value);
  };

  const onShowSizeChange = (current, pageSize) => {
    setPostPerPage(pageSize);
  };

  useEffect(() => {
    dispatch(getAllCourses(query));
  }, [query, refreshKey]);

  // const onSorterChange = (selectedSorter) => {
  //   const sortedDataSource = [...data];
  //   if (selectedSorter === "name") {
  //     sortedDataSource.sort((a, b) =>
  //       a.name > b.name ? 1 : a.name === b.name ? 0 : -1
  //     );
  //   } else if (selectedSorter === "category") {
  //     sortedDataSource.sort((a, b) =>
  //       a.category > b.category ? 1 : a.category === b.category ? 0 : -1
  //     );
  //   } else if (selectedSorter === "price") {
  //     sortedDataSource.sort((a, b) => a.price - b.price);
  //   }
  //   setDataSource(sortedDataSource);
  // };

  return (
    <CoursePageWrapper>
      {pathname !== "/courses" ? (
        <Outlet />
      ) : (
        <>
          <OrdersTitle>
            <div className="starter">
            ?????????? <ArrowRight />{" "}
            </div>
            ???????????????? ??????????
          </OrdersTitle>
          <Header>
            <Title> ???????????????? ??????????</Title>
            <ActionBtn
              bg={"rgb(0, 32, 53)"}
              text={"???????????????? ????????"}
              action={() => setIsOpen(true)}
            />
          </Header>
          <SidePage
            isOpen={isOpen}
            width={width > "900px" ? "100%" : "600px"}
            close={() => {
              setIsOpen(false);
              setEdit({ toggle: false });
            }}
          >
            {edit.toggle !== false ? (
              <EditOrderDrawer
                edit={edit}
                editAction={setEdit}
                openAction={setIsOpen}
                setRefreshKey={setRefreshKey}
                refreshKey={refreshKey}
              />
            ) : (
              <AddOrderDrawer />
            )}
          </SidePage>
          <SearchWrapper>
            <select >
              <option value={"name"}>name</option>
              <option value={"category"}>category</option>
              <option value={"price"}>price</option>
            </select>
            <Search
              placeholder="?????????? ???? ?????????????????? ????????????"
              allowClear
              enterButton="??????????"
              size="large"
              onChange={onSearch}
              style={{
                width: 304,
                marginLeft: "auto",
              }}
            />
          </SearchWrapper>
          {query ? (
            <SearchTable data={data} />
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <TRow>
                    <TH>#</TH>
                    <TH>????????</TH>
                    <TH>??????</TH>
                    <TH>??????????????????</TH>
                    <TH>????????</TH>
                    <TH>??????????</TH>
                    <TH>????????</TH>
                    <TH>????????????</TH>
                    <TH>????????</TH>
                    <TH>
                      <Btn className="edit-svg">
                        <EyeSvg />
                      </Btn>
                    </TH>
                    <TH>
                      <Btn className="edit-svg">
                        <EditSvg />
                      </Btn>
                    </TH>
                    <TH>
                      <Btn className="edit-svg">
                        <DeleteSvg />
                      </Btn>
                    </TH>
                  </TRow>
                </THead>
                <TBody>
                  {currentPosts?.map((item, index) => (
                    <TRow key={item.id}>
                      <TD>{index + 1}</TD>
                      <TD>
                        <img
                          alt={"img"}
                          src={`http://localhost:3005/courses/${item?.image}`}
                        />
                      </TD>
                      <TD>{item.title}</TD>
                      <TD>{item.category.name}</TD>
                      {/* <TD>ai</TD> */}
                      <TD>{item.description}</TD>
                      <TD>{item.trainer}</TD>
                      <TD>{item.fee}</TD>
                      <TD>
                        <Status
                          style={
                            item.status.toLowerCase().trim() === "active"
                              ? { backgroundColor: "#6cb680" }
                              : { backgroundColor: "#ff2020" }
                          }
                          active={item.status}
                        >
                          {item.status}
                        </Status>
                      </TD>
                      <TD>{moment(item.date).format("L")}</TD>
                      <TD>
                        <EditBtn
                          onClick={() => {
                            LinkHandler(navigate, `orders`, item.id);
                          }}
                        >
                          <EyeSvg />
                        </EditBtn>
                      </TD>
                      <TD>
                        <EditBtn
                          onClick={() => {
                            setIsOpen(true);
                            setEdit({ ...edit, item: item, toggle: true });
                          }}
                        >
                          <EditSvg />
                        </EditBtn>
                      </TD>
                      <TD>
                        <DeleteBtn
                          onClick={() => {
                            deleteItem(item.id);
                            setRefreshKey((oldKey) => oldKey + 1);
                          }}
                        >
                          <DeleteSvg />
                        </DeleteBtn>
                      </TD>
                    </TRow>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          )}
          {loading && <Loading />}
          {error === false && loading === false && data.length === 0 && (
            <EmptyBox item="Courses" />
          )}
          {error && <ErrorBox />}

          <Pagination
            onChange={(value) => setPage(value)}
            pageSize={postPerPage}
            total={data.length}
            current={page}
            showSizeChanger
            showQuickJumper
            onShowSizeChange={onShowSizeChange}
          />
        </>
      )}
    </CoursePageWrapper>
  );
};
export default Courses;
