/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Modal } from "react-bootstrap-v5";
import { KTSVG } from "../../helpers";

type Props = {
  show: boolean;
  handleClose: () => void;
};

const SearchModal: React.FC<Props> = ({ show, handleClose }) => {
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
              />
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { SearchModal };
