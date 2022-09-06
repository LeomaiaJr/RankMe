/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTheme } from "../core";

export function Footer() {
  const { classes } = useTheme();
  return (
    <div className={`footer py-4 d-flex flex-lg-column`} id="kt_footer">
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        <div className="text-dark order-2 order-md-1">
          <span className="text-muted fw-bold me-2">
            {new Date().getFullYear()} &copy;
          </span>
          <a className="text-muted fw-bold me-2">
            RankMe
          </a>
        </div>
      </div>
      {/* end::Container */}
    </div>
  );
}
