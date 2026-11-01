import { useFormContext, useWatch } from 'react-hook-form';
import type {
  RegistrationInput,
  RegistrationData,
} from '../model/registration';

export function LiveSummary() {
  const { control } = useFormContext<
    RegistrationInput,
    unknown,
    RegistrationData
  >();

  const values = useWatch({ control });

  const participants = values.participants ?? [];

  return (
    <section className="form-section summary-panel" aria-live="polite">
      <h2 className="h4">Resumen de la solicitud</h2>

      <p>
        <strong>Coordinación:</strong>{' '}
        {values.coordinator?.name || 'Sin registrar'}
      </p>

      <p>
        <strong>Modalidad:</strong>{' '}
        {values.mode === 'presencial' ? 'Presencial' : 'Virtual'}
      </p>

      <p>
        <strong>Aula:</strong>{' '}
        {values.mode === 'presencial'
          ? values.room || 'Pendiente'
          : 'No aplica'}
      </p>

      <p>
        <strong>Prioridad:</strong> {values.priority || 'Normal'}
      </p>

      <p>
        <strong>Presupuesto:</strong>{' '}
        {values.budget ? `S/ ${values.budget}` : 'Sin especificar'}
      </p>

      <p>
        <strong>Participantes:</strong> {participants.length} de 4
      </p>

      <ul>
        {participants.map((person, index) => (
          <li key={`${index}-${person.email}`}>
            {person.name || `Participante ${index + 1}`}
          </li>
        ))}
      </ul>
    </section>
  );
}