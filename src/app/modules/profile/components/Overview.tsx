import React, { useState } from "react";
import { getAuthUserData } from "../../../../util/auth";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import { avatars } from "../../../../util/avatar";
import { updateUserAvatar } from "../../auth/redux/UserCRUD";

export function Overview() {
  const [user, setUser]: any = useState(getAuthUserData());

  return (
    <>
      <div className="row">
        <div className="col align-self-start"></div>
        <div className="col-xxl-4">
          <form>
            <fieldset disabled>
              <label htmlFor="disablledTextInput" className="form-label">
                Nome de usuário
              </label>
              <input
                type="text"
                id="disablledTextInput"
                className="form-control"
                value={user?.name}
                onChange={() => {}}
              />
              <div className="pb-4"></div>
              {user?.nick !== null && (
                <label htmlFor="disablledTextInput" className="form-label">
                  Nick
                </label>
              )}
              {user?.nick !== null && (
                <input
                  type="text"
                  id="disablledTextInput"
                  className="form-control"
                  value={user?.nick}
                  onChange={() => {}}
                />
              )}
              <div className="pb-4"></div>
              <label htmlFor="disablledTextInput" className="form-label">
                Email
              </label>
              <input
                type="text"
                id="disablledTextInput"
                className="form-control"
                value={user?.email}
                onChange={() => {}}
              />
              <div className="pb-4"></div>
              <label htmlFor="disablledTextInput" className="form-label">
                Telefone
              </label>
              <input
                type="text"
                id="disablledTextInput"
                className="form-control"
                value={user?.phone}
                onChange={() => {}}
              />
              <div className="pb-4"></div>
              {user?.course !== null && (
                <label htmlFor="disablledTextInput" className="form-label">
                  Curso
                </label>
              )}
              {user?.course !== null && (
                <input
                  type="text"
                  id="disablledTextInput"
                  className="form-control"
                  value={user?.course}
                  onChange={() => {}}
                />
              )}
              <div className="pb-4"></div>
              <label htmlFor="disablledTextInput" className="form-label">
                Matrícula
              </label>
              <input
                type="text"
                id="disablledTextInput"
                className="form-control"
                value={user?.register_id}
                onChange={() => {}}
              />
            </fieldset>
          </form>
          <button
            style={{ marginTop: "20px" }}
            type="button"
            className="btn btn-active-primary center mx-auto"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_1"
          >
            <span>Avatar</span>
          </button>
        </div>
        <div className="col align-self-end"></div>
      </div>

      <div>
        <div className="modal fade" tabIndex={-1} id="kt_modal_1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecionar Avatar</h5>
                <img
                  alt="Logo"
                  src={toAbsoluteUrl(`/media/svg/avatars/${user.avatar}.svg`)}
                  className="mh-55px"
                />
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
                <div className="row g-5">
                  {avatars.map((avatar, index) => {
                    return (
                      <div className="col-lg-4" key={index}>
                        <div className="card card-custom overlay overflow-hidden">
                          <div className="card-body p-0 ">
                            <div className="overlay-wrapper">
                              <img
                                alt="Logo"
                                src={toAbsoluteUrl(
                                  `/media/svg/avatars/${avatar}.svg`
                                )}
                                className="mh-60px me-auto"
                              />
                            </div>
                            <div className="overlay-layer bg-dark bg-opacity-10 ">
                              <button
                                className="btn btn-primary btn-shadow ms-auto"
                                onClick={() => {
                                  console.log(avatar);
                                  setTimeout(async () => {
                                    await updateUserAvatar(user.id, avatar)
                                      .then((response) => {
                                        setUser(response.data);
                                        sessionStorage.removeItem(
                                          "rankme-auth"
                                        );
                                        document.location.href = "/#/logout";
                                        console.log(response.data);
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                      });
                                  });
                                }}
                              >
                                <i className="bi bi-check2-circle"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="modal-footer ">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
