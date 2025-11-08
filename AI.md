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

### Strings
When writing site contents, respect eslintreact/no-unescaped-entities. This is a requirement. Escape chars like &apos; should be used instead of `'`.

## Tools

### ShadCN
If you are creating a new ShadCN component you MUST install it with an `npx` command (like `npx shadcn@latest add badge`). You should NEVER write a ShadCN component from scratch, it should ALWAYS be installed.

### Git

Never git push
