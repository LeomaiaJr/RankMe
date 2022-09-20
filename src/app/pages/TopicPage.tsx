import React, { useEffect, useRef, useState } from "react";
import { getAuthUserData } from "../../util/auth";
import { Link, useParams } from "react-router-dom";
import { KTSVG } from "../../_start/helpers";
import { getTopic } from "../modules/auth/redux/TopicCRUD";
import {
  createQuestion,
  deleteQuestion,
  getQuestionsAvailable,
  studentCanAnswer,
} from "../modules/auth/redux/QuestionCRUD";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";

const questionSchema = Yup.object()
  .shape({
    question_text: Yup.string()
      .min(10, "Mínimo 10 caracteres")
      .max(400, "Máximo de 400 caracteres")
      .required("A introdução é obrigatória"),
    option_a: Yup.string()
      .max(100, "Máximo de 100 caracteres")
      .required("A opção A é obrigatória"),
    option_b: Yup.string()
      .max(100, "Máximo de 100 caracteres")
      .required("A opção B é obrigatória"),
    option_c: Yup.string()
      .max(100, "Máximo de 100 caracteres")
      .required("A opção C é obrigatória"),
    option_d: Yup.string()
      .max(100, "Máximo de 100 caracteres")
      .required("A opção D é obrigatória"),
    correct_option: Yup.string(),
  })
  .required("A pergunta é obrigatória");

const initialValues = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "",
  topic: "id",
};

export function TopicPage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState(getAuthUserData());
  const [topic, setTopic]: any = useState();
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionsAvailable, setQuestionsAvailable] = useState([]);

  const formik = useFormik({
    initialValues,
    validationSchema: questionSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      if (correctAnswer !== "") {
        values.topic = id;
        values.correct_option = correctAnswer;
        setLoading(true);
        setTimeout(() => {
          createQuestion(values)
            .then(({ data }) => {
              setLoading(false);
              window.location.reload();
            })
            .catch((error) => {
              setLoading(false);
              setSubmitting(false);
              setStatus("Verificar o preenchimento dos campos");
            });
        }, 1000);
      } else {
        setStatus("Selecione uma resposta correta");
      }
    },
  });
  useEffect(() => {
    const fetchTopic = async () => {
      await getTopic(id)
        .then(async ({ data }) => {
          setTopic(data[0]);
          if (user.type !== "teacher") {
            await fetchQuestionsAvailable(data[0].class.id);
          } else {
            setQuestionsAvailable(data[0].questions);
          }
        })
        .catch((error) => {});
    };

    const fetchQuestionsAvailable = async (classId: string) => {
      await getQuestionsAvailable({ id: classId })
        .then(({ data }) => {
          setQuestionsAvailable(data);
        })
        .catch((error) => {});
    };

    setTimeout(async () => {
      await fetchTopic();

      setLoading(false);
    }, 10);
  }, [id]);

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion(id)
      .then(({ data }) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewQuestion = async () => {
    formik.handleSubmit();
  };

  const handleCorrectAnswer = (e: any) => {
    setCorrectAnswer(e.target.value);
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
                {topic ? (
                  <div>
                    <h1>{topic?.name}</h1>
                    <Link to={`/class/${topic?.class?.id}`}>
                      <p>{topic?.class?.name}</p>
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="col-lg-4" />
            </div>
            <div className="topics">
              <div className="row g-5" style={{ minHeight: 100 }}>
                {questionsAvailable?.length > 0
                  ? questionsAvailable.map((question: any) => {
                      return (
                        <div className="col-lg-4" key={question.id}>
                          <div className="card card-custom card-stretch-100 shadow mb-5">
                            <div className="card-header">
                              <h3 className="card-title">{question.name}</h3>
                            </div>
                            <div
                              className="card-body"
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "normal",
                              }}
                            >
                              <p>
                                {question.question_text.length > 30
                                  ? question.question_text.substring(0, 30) +
                                    "..."
                                  : question.question_text.concat([
                                      "\t\t\t\t\t\t",
                                    ])}
                              </p>
                            </div>
                            <div className="card-footer mx-auto">
                              {topic?.available_to_answer ? (
                                <button
                                  id={`question-${question.id}`}
                                  title="Responder"
                                  type="button"
                                  className="btn btn-active-primary "
                                  style={{ margin: 5 }}
                                  onClick={() => {
                                    if (user.type === "teacher") {
                                      window.location.href = `/#/question/${question.id}`;
                                    } else {
                                      document
                                        .getElementById(
                                          `question-${question.id}`
                                        )
                                        ?.setAttribute(
                                          "data-kt-indicator",
                                          "on"
                                        );

                                      setTimeout(async () => {
                                        if (
                                          await studentCanAnswer({
                                            student: user.id,
                                            question: question.id,
                                          })
                                            .then(({ data }) => {
                                              return data;
                                            })
                                            .catch((error) => {
                                              return false;
                                            })
                                        ) {
                                          window.location.href = `/#/question/${question.id}`;
                                        }
                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              `question-${question.id}`
                                            )
                                            ?.removeAttribute(
                                              "data-kt-indicator"
                                            );

                                          document
                                            .getElementById(
                                              `question-${question.id}`
                                            )
                                            ?.setAttribute(
                                              "title",
                                              "Essa pergunta não está disponível para você responder"
                                            );
                                        }, 3000);
                                      });
                                    }
                                  }}
                                >
                                  <span className="indicator-label"></span>
                                  <span className="indicator-progress">
                                    Aguarde...
                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                  </span>
                                  <i className="bi bi-pencil-square text-dark fs-2x"></i>
                                </button>
                              ) : null}
                              {user.type === "teacher" && (
                                <button
                                  type="button"
                                  className="btn btn-active-danger "
                                  style={{ margin: 5 }}
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
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
                        <h3 className="card-title">Adicionar Nova Questão</h3>
                      </div>
                      <div className="card-body mx-auto">
                        <button
                          type="button"
                          className="btn btn-active-secondary center"
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
              <h5 className="modal-title">Nova Questão</h5>
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
              <textarea
                {...formik.getFieldProps("question_text")}
                className={
                  clsx(
                    "form-control form-control-lg form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.question_text &&
                        formik.errors.question_text,
                    },
                    {
                      "is-valid":
                        formik.touched.question_text &&
                        !formik.errors.question_text,
                    }
                  ) + "form-control form-control-flush"
                }
                placeholder="Texto da questão"
              />
              {formik.touched.question_text && formik.errors.question_text && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.question_text}
                  </div>
                </div>
              )}

              <table className="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">
                    <th>Opção</th>
                    <th>É Resposta?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        {...formik.getFieldProps("option_a")}
                        className={
                          clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.option_a &&
                                formik.errors.option_a,
                            },
                            {
                              "is-valid":
                                formik.touched.option_a &&
                                !formik.errors.option_a,
                            }
                          ) + "form-control form-control-flush"
                        }
                        placeholder="Opção A"
                      />
                      {formik.touched.option_a && formik.errors.option_a && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.option_a}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="mb-10">
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="A"
                            id="A"
                            name="flexRadioDefault"
                            onChange={handleCorrectAnswer}
                          />
                          <label
                            className="form-check-label"
                            form="flexRadioDefault"
                          >
                            A
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        {...formik.getFieldProps("option_b")}
                        className={
                          clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.option_b &&
                                formik.errors.option_b,
                            },
                            {
                              "is-valid":
                                formik.touched.option_b &&
                                !formik.errors.option_b,
                            }
                          ) + "form-control form-control-flush"
                        }
                        placeholder="Opção B"
                      />
                      {formik.touched.option_b && formik.errors.option_b && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.option_b}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="mb-10">
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="B"
                            id="B"
                            name="flexRadioDefault"
                            onChange={handleCorrectAnswer}
                          />
                          <label
                            className="form-check-label"
                            form="flexRadioDefault"
                          >
                            B
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        {...formik.getFieldProps("option_c")}
                        className={
                          clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.option_c &&
                                formik.errors.option_c,
                            },
                            {
                              "is-valid":
                                formik.touched.option_c &&
                                !formik.errors.option_c,
                            }
                          ) + "form-control form-control-flush"
                        }
                        placeholder="Opção C"
                      />
                      {formik.touched.option_c && formik.errors.option_c && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.option_c}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="mb-10">
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="C"
                            id="C"
                            name="flexRadioDefault"
                            onChange={handleCorrectAnswer}
                          />
                          <label
                            className="form-check-label"
                            form="flexRadioDefault"
                          >
                            C
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        {...formik.getFieldProps("option_d")}
                        className={
                          clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.option_d &&
                                formik.errors.option_d,
                            },
                            {
                              "is-valid":
                                formik.touched.option_d &&
                                !formik.errors.option_d,
                            }
                          ) + "form-control form-control-flush"
                        }
                        placeholder="Opção D"
                      />
                      {formik.touched.option_d && formik.errors.option_d && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.option_d}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="mb-10">
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="D"
                            id="D"
                            name="flexRadioDefault"
                            onChange={handleCorrectAnswer}
                          />
                          <label
                            className="form-check-label"
                            form="flexRadioDefault"
                          >
                            D
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              {formik.touched.correct_option && formik.errors.correct_option && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.correct_option}
                  </div>
                </div>
              )}
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
                onClick={handleNewQuestion}
                disabled={
                  formik.isSubmitting || !formik.isValid || correctAnswer === ""
                }
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
