import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import { clinicFactory } from "../factories/clinic";
import { doctorFactory } from "../factories/doctor";
import { queueFactory } from "../factories/queue";
import { destroyQueuesByIds } from "../helpers/queue-helpers";
import { destroyClinicById } from "../helpers/clinic-helpers";
import { destroyDoctorsByIds } from "../helpers/doctor-helpers";
import { ticketFactory } from "../factories/ticket";
import { patientFactory } from "../factories/patient";
import { destroyTicketsByIds } from "../helpers/ticket-helpers";
import { destroyPatientsByIds } from "../helpers/patient-helpers";
import objectContaining = jasmine.objectContaining;

describe("#Ticket Route Integration Test", () => {
  let clinicId: number;
  let doctorId: number;
  let queueId: number;
  let ticketId: number;
  let patientId: number;

  const TICKETS_PATH = "/api/v1/tickets";

  beforeAll(async () => {
    const clinicCreated = await clinicFactory.build();
    const patientCreated = await patientFactory.build();
    const doctorCreated = await doctorFactory.build();
    const queueCreated = await queueFactory.build(
      {
        clinicId: clinicCreated.id,
        doctorId: doctorCreated.id,
      },
    );

    clinicId = clinicCreated.id;
    doctorId = doctorCreated.id;
    queueId = queueCreated.id;
    patientId = patientCreated.id;
    const ticketCreated = await ticketFactory.build({
      patientId,
      clinicId,
      queueId,
    });
    ticketId = ticketCreated.id;
  });

  afterAll(async () => {
    await destroyQueuesByIds([ queueId ]);
    await destroyClinicById([ clinicId ]);
    await destroyDoctorsByIds([ doctorId ]);
    await destroyPatientsByIds([ patientId ]);
    await destroyTicketsByIds([ ticketId ]);
  });

  describe("#GET /tickets", () => {
    it("should create queue successfully given clinic exists", async () => {
      await request(app)
        .get(TICKETS_PATH)
        .expect(StatusCodes.OK);
    });
  });

  describe("#GET /tickets/:id", () => {
    it("should get the tickets via id", async () => {
      const response = await request(app)
        .get(`${TICKETS_PATH}/${ticketId}`)
        .expect(StatusCodes.OK);
      expect(response.body).toMatchObject(objectContaining({ id: ticketId }));
    });
  });
});
