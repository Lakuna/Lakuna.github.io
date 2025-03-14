import { loadEnvConfig } from "@next/env";

/**
 * Environment details, as loaded from `.env*` files.
 * @public
 */
export default loadEnvConfig(process.cwd());
