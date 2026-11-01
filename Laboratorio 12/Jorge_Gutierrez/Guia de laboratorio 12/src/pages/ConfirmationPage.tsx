import { Link } from 'react-router';
import type { Receipt } from '../model/registration';

interface ConfirmationPageProps {
  readonly receipt: Receipt | null;
}

export function ConfirmationPage({ receipt }: ConfirmationPageProps) {
  if (!receipt) {
    return (
      <>
        <h1>No hay una inscripción confirmada</h1>

        <p>No hay una solicitud en memoria.</p>

        <Link to="/" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </>
    );
  }

  return (
    <section className="confirmation-panel">
      <p className="eyebrow">SOLICITUD PROCESADA</p>

      <h1>Confirmación de laboratorio</h1>

      <p>La solicitud se procesó correctamente.</p>

      <p>
        <strong>Código de referencia:</strong>
      </p>

      <p role="status">{receipt.reference}</p>

      <h2 className="h4">Datos de la solicitud</h2>

      <pre className="bg-white border rounded p-3 overflow-auto">
        {JSON.stringify(receipt.payload, null, 2)}
      </pre>

      <Link to="/" className="btn btn-primary">
        Volver al catálogo
      </Link>
    </section>
  );
}