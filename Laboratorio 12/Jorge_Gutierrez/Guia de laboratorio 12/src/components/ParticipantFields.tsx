import { useFieldArray, useFormContext } from 'react-hook-form';

import type {
  RegistrationInput,
  RegistrationData,
} from '../model/registration';

import { FieldMessage } from './FieldMessage';

export function ParticipantFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RegistrationInput, unknown, RegistrationData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  return (
    <fieldset className="form-section">
      <legend className="h4">Participantes</legend>

      {fields.map((field, index) => (
        <div
          className="participant-row border rounded p-3 mb-3"
          key={field.id}
        >
          <h3 className="h6">Participante {index + 1}</h3>

          <div className="row g-3">
            <div className="col-md-6">
              <label
                htmlFor={`participant-${index}-name`}
                className="form-label"
              >
                Nombre participante {index + 1}
              </label>

              <input
                id={`participant-${index}-name`}
                className="form-control"
                aria-invalid={Boolean(
                  errors.participants?.[index]?.name,
                )}
                aria-describedby={`participant-${index}-name-error`}
                {...register(`participants.${index}.name`)}
              />

              <FieldMessage
                id={`participant-${index}-name-error`}
                message={errors.participants?.[index]?.name?.message}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor={`participant-${index}-email`}
                className="form-label"
              >
                Correo participante {index + 1}
              </label>

              <input
                id={`participant-${index}-email`}
                type="email"
                className="form-control"
                aria-invalid={Boolean(
                  errors.participants?.[index]?.email,
                )}
                aria-describedby={`participant-${index}-email-error`}
                {...register(`participants.${index}.email`)}
              />

              <FieldMessage
                id={`participant-${index}-email-error`}
                message={errors.participants?.[index]?.email?.message}
              />
            </div>
          </div>

          {fields.length > 1 && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm mt-3"
              onClick={() => remove(index)}
            >
              Quitar participante {index + 1}
            </button>
          )}
        </div>
      ))}

      <FieldMessage
        id="participants-error"
        message={errors.participants?.root?.message}
      />

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => append({ name: '', email: '' })}
        disabled={fields.length >= 4}
      >
        Añadir participante
      </button>
    </fieldset>
  );
}