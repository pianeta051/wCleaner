import { FC } from "react";
import { Link } from "react-router-dom";

export const CustomerDetails: FC = () => {
  return (
    <div>
      <div>
        <Link to="/admin/customers">Customers </Link> / Perico Perez
      </div>
      <button>Eliminar</button>
      <button>Editar</button>
      <h1>Perico Perez</h1>
      <p>Fake St 123</p>
    </div>
  );
};
