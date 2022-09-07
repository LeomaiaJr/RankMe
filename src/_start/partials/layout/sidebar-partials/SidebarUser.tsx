/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useEffect, useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { KTSVG, toAbsoluteUrl } from "../../../helpers";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import { getCSS } from "../../../assets/ts/_utils";
import { getAuthUserData } from "../../../../util/auth";
export function SidebarUser() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser]: any = useState(getAuthUserData());

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const height = parseInt(getCSS(chartRef.current, "height"));
    const chart = new ApexCharts(chartRef.current, chartOptions(height));
    if (chart) {
      chart.render();
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef]);

  return (
    <div id="kt_sidebar_content" className="py-10 px-2 px-lg-8">
      <div
        className="hover-scroll-y me-lg-n5 pe-lg-4"
        data-kt-scroll="true"
        data-kt-scroll-height="auto"
        data-kt-scroll-offset="10px"
        data-kt-scroll-wrappers="#kt_sidebar_content"
      >
        {/* begin::Card */}
        <div className="card card-custom bg-info">
          {/* begin::Body */}
          <div className="card-body px-0">
            <div className="pt-10"> 
              {/* begin::Chart */}
              <div
                className="d-flex flex-center position-relative bgi-no-repeat bgi-size-contain bgi-position-x-center bgi-position-y-center pt-10"
                style={{
                  backgroundImage: `url('${toAbsoluteUrl(
                    "/media/svg/illustrations/bg-2.svg"
                  )}')`,
                }}
              >
                <div className="position-absolute mb-7">
                  <div className="symbol symbol-circle symbol-100px overflow-hidden d-flex flex-center z-index-1">
                    <span className="symbol-label bg-warning  align-items-end">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/svg/avatars/016-boy-7.svg")}
                        className="mh-75px"
                      />
                    </span>
                  </div>
                </div>
                <div
                  ref={chartRef}
                  id="kt_user_chart"
                  style={{ height: "200px" }}
                ></div>
              </div>
              {/* end::Chart */}

              {/* begin::Items */}
              <div className="pt-4">
                {/* begin::Title */}
                <div className="text-center pb-10">
                  {/* begin::Username */}
                  <h1 className="fw-bolder text-white fs-1 pb-4">
                    {user?.name}
                  </h1>
                  {/* end::Username */}
                  {/* end::Action */}
                  <span className="fw-bolder fs-6 text-primary px-4 py-2 rounded bg-white bg-opacity-10">
                    {user?.type === "student" ? "aluno" : "professor"}
                  </span>
                </div>
                {/* end::Title */}
                
                {/* begin::Row */}
                <div className="row row-cols-2 px-xl-12 sidebar-toolbar">
                  <div className="col p-3">
                    <a
                      href="#"
                      className="btn  p-5 w-100 text-start btn-active-primary"
                    >
                      <span className="text-white fw-bolder fs-1 d-block pb-1">
                        38
                      </span>
                      {user?.type!=="student" &&(<span className="fw-bold">Turmas totais</span>)}
                      {user?.type==="student" &&(<span className="fw-bold fs-7">Turmas matriculadas</span>)}
                    </a>
                  </div>

                  <div className="col p-3">
                    <a
                      href="#"
                      className="btn  p-5 w-100 text-start btn-active-primary"
                    >
                      <span className="text-white fw-bolder fs-1 d-block pb-1">
                        204
                      </span>
                      {user?.type!=="student" &&(<span className="fw-bold">Turmas criadas</span>)}
                      {user?.type==="student" &&(<span className="fw-bold">Respostas enviadas</span>)}
                    </a>
                  </div>
                </div>
                {/* end::Row */}
              </div>
              {/* end::Items */}
            </div>
          </div>
          {/* end::Body */}
        </div>
        {/* end::Card */}
      </div>
    </div>
  );
}

const chartOptions = (height: string | number | undefined): ApexOptions => {
  return {
    series: [74],
    chart: {
      fontFamily: "inherit",
      height: height,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "78%",
        },
        dataLabels: {
          name: {
            show: false,
            fontWeight: "700",
          },
          value: {
            color: "#5E6278",
            fontSize: "30px",
            fontWeight: "700",
            offsetY: 6,
            show: true,
            formatter: (val: number) => {
              return val + "%";
            },
          },
        },
        track: {
          background: "#00A3FF",
          strokeWidth: "100%",
        },
      },
    },
    colors: ["#F1416C"],
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
};
