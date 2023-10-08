import { faker } from "@faker-js/faker"

const generateRandomPerson = () => ({
	address: faker.location.streetAddress(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	phone: faker.phone.number(),
})

// eslint-disable-next-line @typescript-eslint/require-await
const generateRandomPersonAsync = async () => generateRandomPerson()

export { generateRandomPerson, generateRandomPersonAsync }
