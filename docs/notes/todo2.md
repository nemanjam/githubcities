```ts
fix css formatting
separate ssr layouts from client components, maybe server actions for forms
fix danger button text, tab title cursor pointer
fix eslint errors, error checking didnt work before
handle runtime env vars for multiple envs, arm1, opi, rpi, mpc and deploy
runtime env vars - must use ssr components
github actions deploy with tailscale
react-query for fetching or ssr
card list fix flex full height
cva css for components
--------
client components because of localStorage auth
const token = localStorage.getItem('access_token');
refactor backend to use cookie instead of localStorage // important
look in other fastApi starters

git checkout -b feature/cookie-auth

https://github.com/fastapi/full-stack-fastapi-template/pull/1606/files
https://github.com/sinkozs/full-stack-fastapi-template/tree/use-http-only-cookie
https://github.com/fastapi/full-stack-fastapi-template/discussions/1564

fix python formatting, 2 newlines between functions, 1 new lines ..., installed "charliermarsh.ruff" extension
keep backend tests running correctly
migrate cookie logic in frontend
```
