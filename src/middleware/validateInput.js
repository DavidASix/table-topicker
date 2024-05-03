export default async function middleware(input) {
  /*
  Expects array like:
  input = [
    {name: 'email', value: '123@domain.com', type: 'string', regex: 'regex string, options'}
  ]
   */
  for (let item of input) {
    const { name, value, type, regex } = item;
    const isValidType = typeof value === type;
    let isValidRegex = true;
    if (regex) {
      const re = new RegExp(regex);
      isValidRegex = re.test(value);
    }
    if (!isValidType || !isValidRegex) {
      throw { code: 400, message: `${name} is invalid` };
    }
  }
}
