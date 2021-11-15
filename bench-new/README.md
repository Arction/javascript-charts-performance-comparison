
Start benchmark app with

```
npm i
npm start
```

Modify active benchmark by directly editing `config.js` file.

## Reading benchmark measurements

- `"fail"` | If application doesn't display at all or displays incorrectly or performs with absolutely terribly `true`, otherwise `false`.
- `"initialRenderMs"` | Read from console.
- `"cpu"` | Read CPU usage as % from browser developer tools.
- `"fps"` | Read from console. Should be calculated average from period of at least 10 seconds.
