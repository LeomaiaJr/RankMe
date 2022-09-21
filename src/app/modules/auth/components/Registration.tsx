/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { api } from '../../../../infra/api';

const initialValues = {
  name: '',
  nick: '',
  email: '',
  password: '',
  changepassword: '',
  phone: '',
  register_id: '',
  type: 'student',
};

const registrationSchema = Yup.object().shape({
  type: Yup.string().required('O tipo é obrigatório'),
  name: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 100 caracteres')
    .required('O nome é obrigatório')
    .test('valid-name', 'Nome inválido', async (name) => {
      // name cant be string with void spaces
      const namePattern = RegExp('^^(?!\\s*$).+$');
      return namePattern.test(name ?? '');
    }),
  register_id: Yup.number()
    .required('A matrícula é obrigatória')
    .test('valid-register-id', 'Matrícula inválida', async (register_id) => {
      if (register_id) {
        return register_id > 0;
      }
      return false;
    }),
  nick: Yup.string().when('type', {
    is: 'student',
    then: Yup.string()
      .min(3, 'Mínimo de 3 caracteres')
      .max(50, 'Máximo de 100 caracteres')
      .required('O nick é obrigatório')
      .test('valid-nick', 'Nick inválido', async (nick) => {
        const nickPattern = RegExp('^^(?!\\s*$).+$');
        return nickPattern.test(nick ?? '');
      }),
  }),
  phone: Yup.string()
    .matches(/^\d{11}$/, 'O telefone deve conter 11 dígitos')
    .required('O telefone é obrigatório'),
  email: Yup.string()
    .required('O email é obrigatório')
    .test(
      'valid-inatel-email',
      'Email do Inatel inválido. Exemplo: exemplo@ges.inatel.br',
      async (email) => {
        const teacherPattern = RegExp('^[\\w\\.]+(@)inatel\\.br$');
        const studentPattern = RegExp('^[\\w\\.]+(@)[a-z]{3}\\.inatel\\.br$');

        return (
          teacherPattern.test(email ?? '') || studentPattern.test(email ?? '')
        );
      }
    ),
  password: Yup.string()
    .min(6, 'Mínimo de 6 caracteres')
    .max(50, 'Máximo de 100 caracteres')
    .required('A senha é obrigatória'),
  changepassword: Yup.string()
    .required('A confirmação de senha é obrigatória')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'As senhas não conferem'),
    }),
});

export function Registration() {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      api
        .post('users', {
          ...values,
          nick: values.type === 'teacher' ? undefined : values.nick,
          changepassword: undefined,
        })
        .then(() => {
          setLoading(false);
          window.location.href = '/#/auth/login';
        })
        .catch(() => {
          setLoading(false);
          setSubmitting(false);
          setStatus('Erro ao registrar usuário');
        });
    },
  });

  const getClass = (field: 'teacher' | 'student') => {
    if (field === formik.values.type) {
      return 'btn btn-primary';
    }
    return 'btn btn-secondary';
  };

  const handleSelection = (e: any, field: 'teacher' | 'student') => {
    e.preventDefault();
    formik.setFieldValue('type', field);
  };

  return (
    <form
      className="form w-100"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Title */}
      <div className="pb-5">
        <h3 className="fw-bolder text-dark display-6">Criar conta</h3>
        <p className="text-muted fw-bold fs-3">
          Entre com os detalhes da sua conta
        </p>
      </div>
      {/* end::Title */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '10px',
        }}
      >
        <button
          onClick={(e) => {
            handleSelection(e, 'student');
          }}
          className={getClass('student')}
        >
          Aluno
        </button>
        <button
          onClick={(e) => {
            handleSelection(e, 'teacher');
          }}
          className={getClass('teacher')}
        >
          Professor
        </button>
      </div>

      {formik.status && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      )}

      {/* begin::Form group name */}
      <div className="fv-row mb-5">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Nome completo
        </label>
        <input
          placeholder="Nome completo"
          type="text"
          autoComplete="off"
          {...formik.getFieldProps('name')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.name && formik.errors.name,
            },
            {
              'is-valid': formik.touched.name && !formik.errors.name,
            }
          )}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.name}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group nick */}
      {formik.values.type === 'student' && (
        <div className="fv-row mb-5">
          <label className="form-label fs-6 fw-bolder text-dark pt-5">
            Nickname
          </label>
          <input
            placeholder="Nickname"
            type="text"
            autoComplete="off"
            {...formik.getFieldProps('nick')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.nick && formik.errors.nick,
              },
              {
                'is-valid': formik.touched.nick && !formik.errors.nick,
              }
            )}
          />
          {formik.touched.nick && formik.errors.nick && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.nick}</div>
            </div>
          )}
        </div>
      )}
      {/* end::Form group */}

      {/* begin::Form group phone */}
      <div className="fv-row mb-5">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Telefone
        </label>
        <input
          placeholder="Telefone"
          type="text"
          autoComplete="off"
          {...formik.getFieldProps('phone')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.phone && formik.errors.phone,
            },
            {
              'is-valid': formik.touched.phone && !formik.errors.phone,
            }
          )}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.phone}</div>
          </div>
        )}
      </div>

      {/* end::Form group */}

      {/* begin::Form group Email */}
      <div className="fv-row mb-5">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Email
        </label>
        <input
          placeholder="exemplo@ges.inatel.br"
          type="email"
          autoComplete="off"
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.email}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group register_id */}
      <div className="fv-row mb-5">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Matrícula
        </label>
        <input
          placeholder="Matrícula"
          type="number"
          autoComplete="off"
          {...formik.getFieldProps('register_id')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid':
                formik.touched.register_id && formik.errors.register_id,
            },
            {
              'is-valid':
                formik.touched.register_id && !formik.errors.register_id,
            }
          )}
        />
        {formik.touched.register_id && formik.errors.register_id && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.register_id}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className="fv-row mb-5">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Senha
        </label>
        <input
          type="password"
          placeholder="Senha"
          autoComplete="off"
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.password}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className="fv-row mb-10">
        <label className="form-label fs-6 fw-bolder text-dark pt-5">
          Confirme a senha
        </label>
        <input
          type="password"
          placeholder="Senha"
          autoComplete="off"
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid':
                formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid':
                formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.changepassword}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      {/* <div className="fv-row mb-10">
        <div className="form-check form-check-custom form-check-solid mb-5">
          <input
            className="form-check-input"
            type="checkbox"
            id="kt_login_toc_agree"
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className="form-check-label fw-bold text-gray-600"
            htmlFor="kt_login_toc_agree"
          >
            I Agree the{' '}
            <Link to="/auth/terms" className="ms-1">
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          )}
        </div>
      </div> */}
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="d-flex flex-wrap pb-lg-0 pb-5">
        <button
          type="submit"
          id="kt_login_signup_form_submit_button"
          className="btn btn-primary fw-bolder fs-6 px-8 py-4 my-3 me-4"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Enviar</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: 'block' }}>
              Por favor, aguarde...{' '}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
        <Link to="/auth/login">
          <button
            type="button"
            id="kt_login_signup_form_cancel_button"
            className="btn btn-light-primary fw-bolder fs-6 px-8 py-4 my-3"
          >
            Cancelar
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  );
}
