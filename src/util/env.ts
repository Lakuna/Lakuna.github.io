import { type Env, type LoadedEnvFiles, loadEnvConfig } from "@next/env";

/**
 * Environment details, as loaded from `.env*` files.
 * @public
 */
const out: {
	combinedEnv: Env;
	loadedEnvFiles: LoadedEnvFiles;
	parsedEnv: Env | undefined;
} = loadEnvConfig(process.cwd());

export default out;
