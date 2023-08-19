import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

import { server } from './api';

const port = process.env.VITE_PORT || 3088;

server.listen(port, () =>
  console.log(`API available on http://localhost:${port}`)
);
