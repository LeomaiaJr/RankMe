/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Modal } from "react-bootstrap-v5";
import { Link } from "react-router-dom";
import {
  addStudents,
  getClassByString,
} from "../../../app/modules/auth/redux/ClassCRUD";
import { getAuthUserData } from "../../../util/auth";
import { KTSVG } from "../../helpers";

type Props = {
  show: boolean;
  handleClose: () => void;
};

const SearchModal: React.FC<Props> = ({ show, handleClose }) => {
  const [user, setUser] = React.useState(getAuthUserData());
  const [search, setSearch] = React.useState("");
  const [classes, setClasses] = React.useState([]);

  const searchClasses = (searchValue: any) => {
    if (user && user.type === "student") {
      setSearch(searchValue);
      setTimeout(async () => {
        const values = await getClassByString(searchValue);
        setClasses(values.length > 0 ? values : []);
      }, 10);
    }
  };

  return (
    <Modal
      className="bg-white"
      id="kt_header_search_modal"
      aria-hidden="true"
      dialogClassName="modal-fullscreen h-auto"
      show={show}
    >
      <div className="modal-content shadow-none">
        <div className="container w-lg-800px">
          <div className="modal-header d-flex justify-content-end border-0">
            {/* begin::Close */}
            <div
              className="btn btn-icon btn-sm btn-light-primary ms-2"
              onClick={handleClose}
            >
              <KTSVG
                className="svg-icon-2"
                path="/media/icons/duotone/Navigation/Close.svg"
              />
            </div>
            {/* end::Close */}
          </div>
          <div className="modal-body">
            {/* begin::Search */}
            <form className="pb-10">
              <input
                autoFocus
                type="text"
                className="form-control bg-transparent border-0 fs-4x text-center fw-normal"
                name="query"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => searchClasses(e.target.value)}
              />
            </form>
            <div className="row g-5">
              {classes?.length > 0
                ? classes.map((classItem: any) => {
                    return (
                      <div className="col-lg-4" key={classItem.id}>
                        <div className="card card-custom card-stretch-100 shadow mb-5">
                          <div className="card-header">
                            <h3 className="card-title mx-auto">
                              {classItem.name}
                            </h3>
                          </div>
                          <div className="card-body">
                            <span className="text-muted">Alunos: </span>
                            <span className="text-dark fw-bolder">
                              {classItem.students.length}
                            </span>
                            <br />
                            {/* <br /> */}
                            <span className="text-muted">Professor: </span>
                            <span className="text-dark fw-bolder">
                              {classItem.teacher.name}
                            </span>
                          </div>
                          <div className="card-footer mx-auto">
                            <Link to={`#`}>
                              <button
                                type="button"
                                className="btn btn-active-success "
                                style={{ margin: 5 }}
                                onClick={() => {
                                  setTimeout(async () => {
                                    if (user && user.type === "student") {
                                      await addStudents(classItem.id, user.id)
                                        .then(() => {
                                          window.location.reload();
                                        })
                                        .catch((error) => {
                                          console.log("error", error);
                                        });
                                    }
                                  }, 10);
                                }}
                              >
                                <i className="bi bi-plus-square-dotted text-dark fs-2x"></i>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { SearchModal };
