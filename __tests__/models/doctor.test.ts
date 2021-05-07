import Doctor, {DoctorAttributes} from "../../src/models/doctors";

describe("Doctor", () => {
    const doctorIdsToBeDeleted: Array<number> = []
    const doctorAttrs:DoctorAttributes = {
        authId: "abc", email: "abc@gmail.com", firstName: "first",
        lastName: "last", mobileNumber: "123", onDuty: false
    }

    afterAll(async ()=> {
        await Doctor.destroy({where: {id: doctorIdsToBeDeleted}})
    })

    describe("valid", () => {
        it("should create when it has all valid attributes", async () => {
            const doctor = await Doctor.create(doctorAttrs)
            expect(doctor).toBeDefined()

            doctorIdsToBeDeleted.push(doctor.id)
        })
    })
});