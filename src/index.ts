import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

import { app } from './api';

const port = process.env.VITE_PORT || 3088;

app.listen(port, () =>
  console.log(`API available on http://localhost:${port}`)
);
