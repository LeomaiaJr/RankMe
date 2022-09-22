import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../../infra/api';
import { RankData } from '../../../interfaces/rank';
import { getAuthUserData } from '../../../util/auth';
import { toAbsoluteUrl } from '../../helpers';
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
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState<
    | {
        id: string;
        name: string;
      }
    | undefined
  >(undefined);
  const selectedClassRef = useRef(selectedClass?.id);
  const [userClasses, setUserClasses] = useState<
    { id: string; name: string }[]
  >([]);

  const location = useLocation();

  useEffect(() => {
    if (userClasses.length > 0 && location.pathname.includes('class')) {
      const classId = location.pathname.split('/')[2];
      const class_ = userClasses.find((c) => c.id === classId);
      setSelectedClass(class_);
    }
  }, [location.pathname, userClasses]);

  const fetchRankData = async (classId?: string) => {
    setLoading(classId ? false : true);
    const { data } = await api.get('/ranking', {
      params: {
        class: classId ?? selectedClass?.id,
      },
    });
    if (classId !== undefined && classId !== selectedClassRef.current) {
      console.log(`skiping`);
      console.log(classId, selectedClassRef.current);
    } else {
      setRankData(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass?.id !== undefined) {
      fetchRankData();
    }
    selectedClassRef.current = selectedClass?.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  const fetchClasses = async () => {
    const userData = getAuthUserData();

    const currClass = location.pathname.split('/')[2];

    if (userData?.type === 'student') {
      const { data } = await api.get<{ id: string; name: string }[]>(
        `/users/student-classes`,
        {
          params: {
            id: userData.id,
          },
        }
      );

      if (data.length > 0 && currClass === undefined) setSelectedClass(data[0]);
      setUserClasses(data);
    } else {
      const { data } = await api.get('/classes');
      if (data.length > 0 && currClass === undefined) setSelectedClass(data[0]);
      setUserClasses(data);
    }
  };

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClasses();

    intervalId.current = setInterval(() => {
      fetchRankData(selectedClassRef.current);
    }, 8000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColorsData = (index: number) => {
    if (index === 0) {
      return {
        backgroundColor: '#FEE101',
      };
    }
    if (index === 1) {
      return {
        backgroundColor: '#D7D7D7',
      };
    }
    if (index === 2) {
      return {
        backgroundColor: '#A77044',
      };
    }

    return {
      backgroundColor: 'white',
    };
  };

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
              height: '100%',
            }}
          >
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                style={{
                  width: '50%',
                }}
                alt="rankme-logo"
                src={toAbsoluteUrl('/media/svg/rankme/logo_verde.svg')}
              />
            </div>
            {userClasses.length > 0 && !loading && (
              <>
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
                {rankData.length === 0 && !loading && (
                  <p
                    style={{
                      color: 'white',
                    }}
                  >
                    Não encontramos informações do rank da turma selecionada
                  </p>
                )}
                {rankData.length > 0 && !loading && (
                  <div
                    className="card-body pt-0"
                    style={{
                      overflow: 'auto',
                      height: '100%',
                      marginRight: '-16px',
                    }}
                  >
                    {rankData.map((rankItem, index) => (
                      <div
                        className="d-flex flex-wrap align-items-center mb-7"
                        key={rankItem.id}
                      >
                        {/* begin::Symbol */}
                        <div
                          className="symbol-label"
                          style={{
                            ...getColorsData(index),
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
                          <img
                            alt="Logo"
                            src={toAbsoluteUrl(
                              `/media/svg/avatars/${
                                rankItem.student.avatar ?? '001-boy'
                              }.svg`
                            )}
                            className="mh-35px"
                          />
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
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
