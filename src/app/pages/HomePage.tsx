import React, { useEffect, useState } from "react";
import { KTSVG } from "../../_start/helpers";
import { createClass, deleteClass } from "../modules/auth/redux/ClassCRUD";
import { getTeacherClasses, getUserBy } from "../modules/auth/redux/UserCRUD";
import { getAuthUserData } from "../../util/auth";

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const loggedUser = getAuthUserData();
  const userID = loggedUser?.id;
  const userType = loggedUser?.type;

  useEffect(() => {
    const fetchUser = async () => {
      await getUserBy({ id: userID })
        .then(({ data }) => {
          setUser(data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    setTimeout(async () => {
      await fetchUser();
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    const fetchClasses = async (userType: string) => {
      if (userType === "teacher" && userID) {
        await getTeacherClasses(userID)
          .then(({ data }) => {
            setClasses(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    setTimeout(async () => {
      if (userType) {
        await fetchClasses(userType);
      }
      // console.log(classes)
    }, 100);
  }, []);

  const newClass = async () => {
    setLoading(true);
    if (newClassName.length > 0) {
      setTimeout(async () => {
        await createClass({ teacher: user.id, name: newClassName });
        window.location.reload();
      }, 100);
    }
  };

  const handleDeleteClass = async (id: string) => {
    await deleteClass(id);
    window.location.reload();
  };

  return (
    <div>
      <h1>{user?.name ?? "-"}</h1>
      <p>Minhas Turmas</p>

      <div className="classes">
        <div className="row g-5" style={{ minHeight: 100 }}>
          {classes.length > 0
            ? classes.map((classItem: any) => {
                return (
                  <div className="col-lg-4" key={classItem.id}>
                    <div className="card card-custom card-stretch-100 shadow mb-5">
                      <div className="card-header">
                        <h3 className="card-title">{classItem.name}</h3>
                      </div>
                      <div className="card-body">
                        Alunos: {classItem.students.length}
                      </div>
                      <div className="card-footer mx-auto">
                        <button
                          type="button"
                          className="btn btn-active-success "
                          style={{ margin: 5 }}
                        >
                          <i className="bi bi-eyeglasses text-dark fs-2x"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-active-danger "
                          style={{ margin: 5 }}
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          <i className="bi bi-trash3 text-dark fs-2x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}

          {user?.type === "teacher" ? (
            <div className="col-lg-4">
              <div className="card card-custom card-stretch-100 shadow mb-5">
                <div className="card-header">
                  <h3 className="card-title">Adicionar Nova Turma</h3>
                </div>
                <div className="card-body mx-auto">
                  <button
                    type="button"
                    className="btn btn-active-secondary center"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_1"
                  >
                    <i className="bi bi-plus-square-dotted text-dark fs-2x"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>{user?.type ?? "-"}</p>
          )}
        </div>
      </div>

      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nova Turma</h5>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <KTSVG
                  path="/media/icons/duotone/Navigation/Close.svg"
                  className="svg-icon svg-icon-2x"
                />
              </div>
            </div>
            <div className="modal-body">
              <input
                type="email"
                value={newClassName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    newClass();
                  }
                }}
                onChange={(e) => setNewClassName(e.target.value)}
                className="form-control form-control-flush"
                placeholder="Sigla da Turma (Ex: M001-A)"
              />
            </div>
            <div className="modal-footer ">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={newClass}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
