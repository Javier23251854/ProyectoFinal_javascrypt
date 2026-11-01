import { describe, expect, it } from 'vitest';
import { buildPayload, registrationSchema } from './registration';
import { validInput } from '../test/helpers';

describe('registrationSchema', () => {
  it('accepts zero and transforms the budget into a number', () => {
    const output = registrationSchema.parse(validInput());

    expect(output.budget).toBe(0);
    expect(output.coordinator.email).toBe('ana@example.test');
  });

  it.each(['', '-1', '20,50', '5000.01'])(
    'rejects the invalid budget %s',
    (budget) => {
      expect(
        registrationSchema.safeParse({
          ...validInput(),
          budget,
        }).success,
      ).toBe(false);
    },
  );

  it('rejects more than two decimal places', () => {
    expect(
      registrationSchema.safeParse({
        ...validInput(),
        budget: '10.555',
      }).success,
    ).toBe(false);
  });

  it('normalizes emails to lowercase', () => {
    const output = registrationSchema.parse(validInput());

    expect(output.coordinator.email).toBe('ana@example.test');
  });

  it('rejects an invalid coordinator email', () => {
    expect(
      registrationSchema.safeParse({
        ...validInput(),
        coordinator: {
          name: 'Ana Torres',
          email: 'correo-invalido',
        },
      }).success,
    ).toBe(false);
  });

  it('rejects repeated participant emails', () => {
    const input = validInput();

    input.participants.push({
      name: 'María López',
      email: 'LUIS@example.test',
    });

    expect(registrationSchema.safeParse(input).success).toBe(false);
  });

  it('allows the coordinator email to match a participant', () => {
    const input = validInput();

    input.participants[0]!.email = 'ANA@example.test';

    expect(registrationSchema.safeParse(input).success).toBe(true);
  });

  it('requires a room for in-person attendance', () => {
    expect(
      registrationSchema.safeParse({
        ...validInput(),
        mode: 'presencial',
        room: '',
      }).success,
    ).toBe(false);
  });

  it('accepts a valid room for in-person attendance', () => {
    expect(
      registrationSchema.safeParse({
        ...validInput(),
        mode: 'presencial',
        room: 'Aula B201',
      }).success,
    ).toBe(true);
  });

  it('rejects more than four participants', () => {
    const input = validInput();

    input.participants = Array.from({ length: 5 }, (_, index) => ({
      name: `Persona ${index + 1}`,
      email: `persona${index + 1}@example.test`,
    }));

    expect(registrationSchema.safeParse(input).success).toBe(false);
  });

  it('requires acceptance of the conditions', () => {
    expect(
      registrationSchema.safeParse({
        ...validInput(),
        accepted: false,
      }).success,
    ).toBe(false);
  });

  it('excludes the room from a virtual payload', () => {
    const data = registrationSchema.parse({
      ...validInput(),
      room: 'Aula B201',
    });

    const payload = buildPayload('react', data);

    expect(payload).not.toHaveProperty('room');
  });

  it('includes the room in an in-person payload', () => {
    const data = registrationSchema.parse({
      ...validInput(),
      mode: 'presencial',
      room: 'Aula B201',
    });

    const payload = buildPayload('react', data);

    expect(payload.room).toBe('Aula B201');
  });
});