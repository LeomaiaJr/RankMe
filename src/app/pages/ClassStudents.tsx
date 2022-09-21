import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuthUserData } from "../../util/auth";
import { getClass, getStudents } from "../modules/auth/redux/ClassCRUD";

export function ClassStudents() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState(getAuthUserData());
  const [class_, setClass]: any = useState();
  const [students, setStudents]: any = useState();

  useEffect(() => {
    const fetchClass = async () => {
      await getClass(id)
        .then(({ data }) => {
          setClass(data[0]);
        })
        .catch((error) => {});
    };

    const fetchStudents = async () => {
      await getStudents(id)
        .then(({ data }) => {
          setStudents(data[0].students);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    setTimeout(async () => {
      await fetchClass();
      await fetchStudents();
      setLoading(false);
    }, 100);
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="row g-12 " style={{ minHeight: 100 }}>
            <div className="col-lg-6">
              {class_ ? (
                <div>
                  <Link to={`/class/${class_?.id}`}>
                    <h1>{class_?.name}</h1>
                  </Link>
                  <h2>{class_?.teacher.name}</h2>
                </div>
              ) : null}
            </div>
            <div className="col-lg-4" />
          </div>
          <table className="table table-rounded table-striped border gy-7 gs-7">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">
                <th>Nome</th>
                <th>Nick</th>
                <th>Score</th>
                <th>E-mail</th>
                <th>Curso</th>
                <th>Matrícula</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student: any) => {
                  return (
                    <tr>
                      <td>
                        {student.name.length > 15
                          ? student.name.substring(0, 15) + "..."
                          : student.name.concat(["\t\t\t\t\t\t"])}
                      </td>
                      <td>{student.nick}</td>
                      <td>{student.rankings[0].score}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>{student.register_id}</td>
                      <td>{student.phone}</td>
                    </tr>
                  );
                })
              ) : (
                <>
                  <h3>Não há alunos nessa turma</h3>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
