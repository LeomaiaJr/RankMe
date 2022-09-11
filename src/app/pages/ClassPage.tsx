import React, { useEffect, useState } from "react";
import { getClass } from "../modules/auth/redux/ClassCRUD";
import { getAuthUserData } from "../../util/auth";
import { Link, useParams } from "react-router-dom";
import { KTSVG } from "../../_start/helpers";
import {
  closeTopic,
  createTopic,
  deleteTopic,
  makeResultsAvailable,
  openTopic,
} from "../modules/auth/redux/TopicCRUD";

export function ClassPage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState(getAuthUserData());
  const [class_, setClass]: any = useState();
  const [newTopicName, setNewTopicName] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      await getClass(id)
        .then(({ data }) => {
          setClass(data[0]);
        })
        .catch((error) => {});
    };

    setTimeout(async () => {
      await fetchClass();
      setLoading(false);
    }, 100);
  }, [id]);

  const handleDeleteTopic = async (id: string) => {
    await deleteTopic(id)
      .then(({ data }) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewTopic = async () => {
    if (newTopicName.length > 0) {
      await createTopic({
        class: class_.id,
        name: newTopicName,
        available_to_answer: false,
        results_available: false,
      });
      window.location.reload();
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="row g-12 " style={{ minHeight: 100 }}>
              <div className="col-lg-6">
                {class_ ? (
                  <div>
                    <h1>{class_?.name}</h1>
                    <h2>{class_?.teacher.name}</h2>
                  </div>
                ) : null}
              </div>
              <div className="col-lg-4" />
            </div>
            <div className="topics">
              <div className="row g-5" style={{ minHeight: 100 }}>
                {class_.topics.length > 0
                  ? class_.topics.map((topic: any) => {
                      return (
                        <div className="col-lg-4" key={topic.id}>
                          <div className="card card-custom card-stretch-100 shadow mb-5">
                            <div className="card-header">
                              <h3 className="card-title">{topic.name}</h3>
                            </div>
                            <div className="card-body mx-auto">
                              {user.type === "teacher" ? (
                                <div className="mx-auto">
                                  {!topic.available_to_answer ? (
                                    <button
                                      type="button"
                                      className="btn btn-active-primary mx-auto"
                                      style={{ margin: 5 }}
                                      onClick={() => {
                                        setTimeout(async () => {
                                          await openTopic(topic.id)
                                            .then(({ data }) => {
                                              window.location.reload();
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                            });
                                        });
                                      }}
                                    >
                                      <i className="bi bi-eye text-dark fs-2x"></i>
                                      <span className="text-dark fw-bolder">
                                        {" "}
                                        Abrir
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-active-primary "
                                      style={{ margin: 5 }}
                                      onClick={() => {
                                        setTimeout(async () => {
                                          await closeTopic(topic.id)
                                            .then(({ data }) => {
                                              window.location.reload();
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                            });
                                        });
                                      }}
                                    >
                                      <i className="bi bi-eye-slash text-dark fs-2x"></i>
                                      <span className="text-dark fw-bolder">
                                        {" "}
                                        Fechar
                                      </span>
                                    </button>
                                  )}
                                  <button
                                      type="button"
                                      className="btn btn-active-primary "
                                      style={{ margin: 5 }}
                                      onClick={() => {
                                        setTimeout(async () => {
                                          await makeResultsAvailable(topic.id)
                                            .then(({ data }) => {
                                              window.location.reload();
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                            });
                                        });
                                      }}
                                    >
                                      <i className={`bi ${!topic.results_available ? 'bi-send-check' : 'bi-send-slash'} text-dark fs-2x`}></i>
                                      <span className="text-dark fw-bolder">
                                        {" "}
                                        {!topic.results_available ? 'Disponibilizar' : 'Retirar'} Resultados
                                      </span>
                                    </button>
                                </div>
                              ) : null}
                            </div>
                            <div className="card-footer mx-auto">
                              {(topic.available_to_answer ||
                                user.type === "teacher") && (
                                <Link to={`/topic/${topic.id}`}>
                                  <button
                                    type="button"
                                    className="btn btn-active-primary "
                                    style={{ margin: 5 }}
                                  >
                                    <i className="bi bi-pencil-square text-dark fs-2x"></i>
                                  </button>
                                </Link>
                              )}
                              {user.type === "teacher" && (
                                <button
                                  type="button"
                                  className="btn btn-active-danger "
                                  style={{ margin: 5 }}
                                  onClick={() => handleDeleteTopic(topic.id)}
                                >
                                  <i className="bi bi-trash3 text-dark fs-2x"></i>
                                </button>
                              )}
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
                        <h3 className="card-title">Adicionar Novo Tópico</h3>
                      </div>
                      <div className="card-body mx-auto">
                        <button
                          type="button"
                          className="btn btn-active-primary center"
                          data-bs-toggle="modal"
                          data-bs-target="#kt_modal_1"
                        >
                          <i className="bi bi-journal-plus text-dark fs-2x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Novo Tópico</h5>
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
                type="text"
                value={newTopicName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNewTopic();
                  }
                }}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="form-control form-control-flush"
                placeholder="Tópico (Capítulo)"
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
                onClick={handleNewTopic}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
