import React, { useState } from "react";
import { getAuthUserData } from "../../../../util/auth";

export function Overview() {
  const [user, setUser]: any = useState(getAuthUserData());

  return (
    <div className="row">
      <div className="col align-self-start"></div>
      <div className="col-xxl-4">
        <form>
          <fieldset disabled>
            <label htmlFor="disablledTextInput" className="form-label">Nome de usuário</label>
              <input type="text" id="disablledTextInput" className="form-control" value={user?.name} />
              <div className="pb-4"></div>
            {user?.nick!==null &&(<label htmlFor="disablledTextInput" className="form-label">Nick</label>)}
              {user?.nick!==null &&(<input type="text" id="disablledTextInput" className="form-control"value={user?.nick} />)}
              <div className="pb-4"></div>
            <label htmlFor="disablledTextInput" className="form-label">Email</label>
              <input type="text" id="disablledTextInput" className="form-control" value={user?.email} />
              <div className="pb-4"></div>
            <label htmlFor="disablledTextInput" className="form-label">Telefone</label>
              <input type="text" id="disablledTextInput" className="form-control" value={user?.phone} />
              <div className="pb-4"></div>
            {user?.course!==null &&(<label htmlFor="disablledTextInput" className="form-label">Curso</label>)}
            {user?.course!==null &&(<input type="text" id="disablledTextInput" className="form-control" value={user?.course} />)}
              <div className="pb-4"></div>  
            <label htmlFor="disablledTextInput" className="form-label">Matrícula</label>
              <input type="text" id="disablledTextInput" className="form-control" value={user?.register_id} />
          </fieldset>
        </form>
      </div>
      <div className="col align-self-end"></div>
    </div>
  );
}
