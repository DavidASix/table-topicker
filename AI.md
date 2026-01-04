# CLAUDE.md

See @README.md for project overview and @package.json


## Development Conventions

### Code Style

- Use `camelCase` except for database fields which are `snake_case` (due to SQL case-sensitivity)
- Prefer optional chaining: `address?.postalCode` over `address && address.postalCode`

### Type Safety Rules

- **Never use `any`** - use `unknown` instead if type is unknown
- **Avoid `as unknown as Type`** - indicates wrong approach
- **Avoid `as Type`** - also indicates wrong approach

### Type Conventions
- If a function has more than 23 arguments (named or unnamed) declare the type for the arguments as a type above the function and use that type as the argument type for the function.

### Strings
When writing site contents, respect eslintreact/no-unescaped-entities. This is a requirement. Escape chars like &apos; should be used instead of `'`.

### Components
- Where possible, always prefer leaning on ShadCN components over writing your own. This ensures consistency across the app.

## Tools

### ShadCN
If you are creating a new ShadCN component you MUST install it with an `npx` command (like `npx shadcn@latest add badge`). You should NEVER write a ShadCN component from scratch, it should ALWAYS be installed.

### Git

Never git push
