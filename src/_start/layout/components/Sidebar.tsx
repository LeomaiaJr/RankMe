import React, { useRef, useEffect, useState } from 'react';
import { api } from '../../../infra/api';
import { ClassData } from '../../../interfaces/classes';
import { RankData } from '../../../interfaces/rank';
import { getAuthToken, getAuthUserData } from '../../../util/auth';
import { toAbsoluteUrl } from '../../helpers';
import { SidebarGeneral, SidebarShop, SidebarUser } from '../../partials';
import { useTheme } from '../core';

const BG_COLORS = ['bg-white', 'bg-info'];

export function Sidebar() {
  const { config, classes } = useTheme();
  const sidebarCSSClass = classes.sidebar;
  const sideBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sidebarCSSClass) {
      return;
    }

    BG_COLORS.forEach((cssClass) => {
      sideBarRef.current?.classList.remove(cssClass);
    });

    sidebarCSSClass.forEach((cssClass) => {
      sideBarRef.current?.classList.add(cssClass);
    });
  }, [sidebarCSSClass]);

  const [rankData, setRankData] = useState<RankData[]>([]);

  const [selectedClass, setSelectedClass] = useState<
    | {
        id: string;
        name: string;
      }
    | undefined
  >(undefined);
  const [userClasses, setUserClasses] = useState<
    { id: string; name: string }[]
  >([]);

  const fetchRankData = async () => {
    const { data } = await api.get('/ranking', {
      params: {
        class: selectedClass?.id,
      },
    });
    setRankData(data);
  };

  useEffect(() => {
    if (selectedClass?.id !== undefined) {
      fetchRankData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  const fetchClasses = async () => {
    const userData = getAuthUserData();

    if (userData?.type === 'student') {
      const { data } = await api.get<{ id: string; name: string }[]>(
        `/users/student-classes`,
        {
          params: {
            id: userData.id,
          },
        }
      );
      setUserClasses(data);
    } else {
      const { data } = await api.get('/classes');
      setUserClasses(data);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <>
      {config.sidebar.display && (
        <div
          ref={sideBarRef}
          id="kt_sidebar"
          className="sidebar"
          data-kt-drawer="true"
          data-kt-drawer-name="sidebar"
          data-kt-drawer-activate="{default: true, lg: false}"
          data-kt-drawer-overlay="true"
          data-kt-drawer-width="{default:'200px', '350px': '300px'}"
          data-kt-drawer-direction="end"
          data-kt-drawer-toggle="#kt_sidebar_toggler"
        >
          {/* begin::Sidebar Content */}
          <div
            className="d-flex flex-column sidebar-body"
            style={{
              padding: '0px 16px',
            }}
          >
            RANKME LOGO
            <div
              style={{
                marginTop: '32px',
                marginBottom: '32px',
              }}
            >
              <label
                style={{
                  color: 'white',
                }}
                className="form-label"
              >
                Turma
              </label>
              <select
                style={{
                  width: '80%',
                }}
                className="form-select"
                aria-label="Select example"
                value={selectedClass?.id}
                onChange={(e) => {
                  const selectedClass = userClasses.find(
                    (c) => c.id === e.target.value
                  );
                  setSelectedClass(selectedClass);
                }}
              >
                <option>Selecione a turma</option>
                {userClasses.map((userClass) => (
                  <option value={userClass.id}>{userClass.name}</option>
                ))}
              </select>
            </div>
            <div className="card-body pt-0">
              {rankData.map((rankItem) => (
                <div className="d-flex flex-wrap align-items-center mb-7">
                  {/* begin::Symbol */}
                  <div
                    className="symbol-label bg-light"
                    style={{
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#000',
                      width: '40px',
                      height: '40px',
                      marginRight: '12px',
                    }}
                  >
                    {rankItem.nick[0].toUpperCase()}
                  </div>

                  {/* end::Symbol */}

                  {/* begin::Title */}
                  <div className="d-flex flex-column flex-grow-1 my-lg-0 my-2 pe-3">
                    <span className="text-white fw-bolder fs-6">
                      {rankItem.nick}
                    </span>
                    <span className="text-white opacity-25 fw-bold fs-7 my-1">
                      {rankItem.score} pontos
                    </span>
                  </div>
                  {/* end::Title */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
