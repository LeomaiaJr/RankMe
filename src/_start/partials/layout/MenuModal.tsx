/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap-v5";
import { Link, useLocation } from "react-router-dom";
import { KTSVG } from "../../helpers";

type Props = {
  show: boolean;
  handleClose: () => void;
};

const MenuModal: React.FC<Props> = ({ show, handleClose, children }) => {
  const location = useLocation();
  const isFirstRef = useRef(true);
  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
    } else {
      handleClose();
    }
  }, [location]);

  return (
    <Modal
      className="bg-white"
      id="kt_mega_menu_modal"
      aria-hidden="true"
      tabIndex="-1"
      dialogClassName="modal-fullscreen"
      contentClassName="shadow-none"
      show={show}
    >
      <div className="container">
        <div className="modal-header d-flex align-items-center justify-content-between border-0">
          <div className="d-flex align-items-center">
            {/* begin::Logo */}
            <Link to="/">
              <span className="fw-bolder fs-1 d-block">
                RankMe
              </span>
            </Link>
            {/* end::Logo */}
          </div>

          {/* begin::Close */}
          <div
            className="btn btn-icon btn-sm btn-light-primary ms-2"
            onClick={handleClose}
          >
            <KTSVG
              path="/media/icons/duotone/Navigation/Close.svg"
              className="svg-icon-2"
            />
          </div>
          {/* end::Close */}
        </div>
        <div className="modal-body">
          {/* begin::Row */}
          <div className="row py-10 g-5">
            {/* begin::Column */}
            <div className="col-lg-6 pe-lg-25">{children}</div>
          </div>
            {/* end::Column */}
          {/* end::Row */}
        </div>
      </div>
    </Modal>
  );
};

export { MenuModal };
