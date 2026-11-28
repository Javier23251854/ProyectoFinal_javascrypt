import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import type {
  RegistrationInput,
  RegistrationData,
} from '../model/registration';

import { FieldMessage } from './FieldMessage';

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' },
];

export function WorkshopFields() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationInput, unknown, RegistrationData>();

  const mode = watch('mode');

  return (
    <fieldset className="form-section">
      <legend className="h4">Datos del taller</legend>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="mode" className="form-label">
            Modalidad
          </label>

          <select
            id="mode"
            className="form-select"
            {...register('mode')}
          >
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        {mode === 'presencial' && (
          <div className="col-md-6">
            <label htmlFor="room" className="form-label">
              Aula
            </label>

            <input
              id="room"
              className="form-control"
              aria-invalid={Boolean(errors.room)}
              aria-describedby="room-error"
              {...register('room')}
            />

            <FieldMessage
              id="room-error"
              message={errors.room?.message}
            />
          </div>
        )}

        <div className="col-md-6">
          <label htmlFor="priority" className="form-label">
            Prioridad
          </label>

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                inputId="priority"
                options={priorityOptions}
                value={priorityOptions.find(
                  (option) => option.value === field.value,
                )}
                onChange={(option) => field.onChange(option?.value)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errors.priority)}
              />
            )}
          />

          <FieldMessage
            id="priority-error"
            message={errors.priority?.message}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="budget" className="form-label">
            Presupuesto en soles
          </label>

          <input
            id="budget"
            type="number"
            min="0"
            max="5000"
            step="0.01"
            className="form-control"
            placeholder="Ej. 150.50"
            aria-invalid={Boolean(errors.budget)}
            aria-describedby="budget-error"
            {...register('budget')}
          />

          <FieldMessage
            id="budget-error"
            message={errors.budget?.message}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="participants-count" className="form-label">
            Cantidad de participantes
          </label>

          <input
            id="participants-count"
            className="form-control"
            value={watch('participants').length}
            readOnly
            aria-label="Cantidad actual de participantes"
          />
        </div>
      </div>
    </fieldset>
  );
}