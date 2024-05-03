export default async function middleware(req, expected) {
  if (req.method !== expected) {
    throw { code: 405, message: "Incorrect request type" };
  }
}
