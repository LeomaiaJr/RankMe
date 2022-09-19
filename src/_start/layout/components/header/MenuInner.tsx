/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItem";

export function MenuInner() {
  return (
    <>
      <div className="row">
        <div className="col-sm-4">
          <h3 className="fw-bolder mb-5">Dashboards</h3>
          <ul className="menu menu-column menu-fit menu-rounded menu-gray-600 menu-hover-primary menu-active-primary fw-bold fs-6 mb-10">
            <li className="menu-item">
              <MenuItem to="/home" title="Turmas" />
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <h3 className="fw-bolder mb-5">Perfil</h3>
          <ul className="menu menu-column menu-fit menu-rounded menu-gray-600 menu-hover-primary menu-active-primary fw-bold fs-6 mb-10">
            <li className="menu-item">
              <Link className="menu-link ps-0 py-2" to="/profile/overview">
                Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
