import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getQuestionById,
  updateQuestion,
} from "../modules/auth/redux/QuestionCRUD";
import { getTopic } from "../modules/auth/redux/TopicCRUD";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { toAbsoluteUrl } from "../../_start/helpers";
import { getAuthUserData } from "../../util/auth";
import { submitAnswer } from "../modules/auth/redux/AnswerService";

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
  topic: "",
};

export function QuestionPage() {
  const [user, setUser] = useState(getAuthUserData());
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion]: any = useState();
  const [correctOption, setCorrectOption] = useState("");
  const [correctWasChanged, setCorrectWasChanged] = useState(false);
  const [topic, setTopic]: any = useState();
  const [isStudent, setIsStudent] = useState(user?.type === "student");
  const [isTeacher, setIsTeacher] = useState(user?.type === "teacher");

  const formik = useFormik({
    initialValues,
    validationSchema: questionSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      if (correctOption !== "") {
        values.topic = id;
        values.correct_option = correctOption;
        setLoading(true);
        setTimeout(() => {
          updateQuestion(values)
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
    const fetchQuestion = async () => {
      await getQuestionById(id)
        .then(({ data }) => {
          setQuestion(data[0]);
          setCorrectOption(data[0].correct_option);
          fetchTopic(data[0].topic);
          formik.setValues({
            ...data[0],
          });
        })
        .catch((error) => {});
    };

    const fetchTopic = async (topic: any) => {
      await getTopic(topic)
        .then(({ data }) => {
          setTopic(data[0]);
        })
        .catch((error) => {});
    };

    setTimeout(async () => {
      await fetchQuestion();
      setLoading(false);
    }, 100);
  }, [id]);

  const handleUpdateQuestion = async () => {
    formik.handleSubmit();
  };

  const handleSelectedOption = (option: string) => {
    setCorrectOption(option);
    setCorrectWasChanged(true);
  };

  const handleSendAnswer = async () => {
    if (correctWasChanged) {
      const answer = {
        answer: correctOption,
        question: question?.id,
        student: user?.id,
        class: topic?.class.id,
      };

      await submitAnswer(answer);
      window.location.href = `/topic/${topic.id}`;
    }
  };

  return (
    <>
      {loading ? (
        <div className="align-itens-center mx-auto">
          <div>Loading...</div>
          <img
            alt="Logo"
            src={toAbsoluteUrl("/media/rankme-logo/logo-verde.svg")}
            className="mh-100px"
          />
        </div>
      ) : (
        <div>
          <div className="row g-12 " style={{ minHeight: 100 }}>
            <div className="col-lg-6">
              {topic ? (
                <div>
                  <Link to={"/topic/" + topic?.id}>
                    <h1>{topic?.name}</h1>
                  </Link>
                  <p>{topic?.class?.name}</p>
                </div>
              ) : null}
            </div>
            <div className="col-lg-4" />
          </div>

          <div className="mb-10">
            <label className="form-label">Texto da questão</label>
            <textarea
              {...formik.getFieldProps("question_text")}
              value={formik.values.question_text}
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
                ) + "form-control "
              }
              readOnly={isStudent}
              placeholder="Texto da questão"
            />
            {formik.touched.question_text && formik.errors.question_text && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.question_text}
                </div>
              </div>
            )}
          </div>
          {!correctWasChanged && !isStudent ? (
            <div style={{ marginBottom: 10 }}>
              <span className="text-muted">Resposta correta atual: </span>
              <span className="text-dark fw-bolder">{correctOption}</span>
              <br />
            </div>
          ) : null}
          <div>
            <div className="row g-5">
              <div className="col-lg-1">
                <div className="mb-10">
                  <div className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="A"
                      id="A"
                      name="flexRadioDefault"
                      onChange={() => {
                        handleSelectedOption("A");
                      }}
                    />
                    <label className="form-check-label" form="flexRadioDefault">
                      A
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-11">
                <div className="mb-10">
                  {/* <label className="form-label">Default input</label> */}
                  <input
                    type="text"
                    {...formik.getFieldProps("option_a")}
                    className={
                      clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.option_a && formik.errors.option_a,
                        },
                        {
                          "is-valid":
                            formik.touched.option_a && !formik.errors.option_a,
                        }
                      ) + "form-control "
                    }
                    placeholder="Opção A"
                    readOnly={isStudent}
                  />
                  {formik.touched.option_a && formik.errors.option_a && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formik.errors.option_a}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row g-5">
              <div className="col-lg-1">
                <div className="mb-10">
                  <div className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="B"
                      id="B"
                      name="flexRadioDefault"
                      onChange={() => {
                        handleSelectedOption("B");
                      }}
                    />
                    <label className="form-check-label" form="flexRadioDefault">
                      B
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-11">
                <div className="mb-10">
                  {/* <label className="form-label">Default input</label> */}
                  <input
                    type="text"
                    {...formik.getFieldProps("option_b")}
                    className={
                      clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.option_b && formik.errors.option_b,
                        },
                        {
                          "is-valid":
                            formik.touched.option_b && !formik.errors.option_b,
                        }
                      ) + "form-control "
                    }
                    placeholder="Opção B"
                    readOnly={isStudent}
                  />
                  {formik.touched.option_b && formik.errors.option_b && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formik.errors.option_b}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row g-5">
              <div className="col-lg-1">
                <div className="mb-10">
                  <div className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="C"
                      id="C"
                      name="flexRadioDefault"
                      onChange={() => {
                        handleSelectedOption("C");
                      }}
                    />
                    <label className="form-check-label" form="flexRadioDefault">
                      C
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-11">
                <div className="mb-10">
                  {/* <label className="form-label">Default input</label> */}
                  <input
                    type="text"
                    {...formik.getFieldProps("option_c")}
                    className={
                      clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.option_c && formik.errors.option_c,
                        },
                        {
                          "is-valid":
                            formik.touched.option_c && !formik.errors.option_c,
                        }
                      ) + "form-control "
                    }
                    placeholder="Opção C"
                    readOnly={isStudent}
                  />
                  {formik.touched.option_c && formik.errors.option_c && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formik.errors.option_c}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row g-5">
              <div className="col-lg-1">
                <div className="mb-10">
                  <div className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="D"
                      id="D"
                      name="flexRadioDefault"
                      onChange={() => {
                        handleSelectedOption("D");
                      }}
                    />
                    <label className="form-check-label" form="flexRadioDefault">
                      D
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-11">
                <div className="mb-10">
                  <input
                    type="text"
                    {...formik.getFieldProps("option_d")}
                    className={
                      clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.option_d && formik.errors.option_d,
                        },
                        {
                          "is-valid":
                            formik.touched.option_d && !formik.errors.option_d,
                        }
                      ) + "form-control "
                    }
                    placeholder="Opção D"
                    readOnly={isStudent}
                  />
                  {formik.touched.option_d && formik.errors.option_d && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formik.errors.option_d}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateQuestion}
              hidden={isStudent}
            >
              Atualizar
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setTimeout(async () => {
                  await handleSendAnswer();
                });
              }}
              hidden={isTeacher}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
