/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { CreateAppModal } from "../_modals/create-app-stepper/CreateAppModal";

export const StartDashboardPage: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      {/* begin::Row */}
      <div className="row g-0 g-xl-5 g-xxl-8">
        <div className="col-xl-4">
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row g-0 g-xl-5 g-xxl-8">
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row g-0 g-xl-5 g-xxl-8">
      </div>
      {/* end::Row */}

      {/* begin::Modals */}
      <CreateAppModal show={show} handleClose={() => setShow(false)} />
      {/* end::Modals */}
    </>
  );
};
