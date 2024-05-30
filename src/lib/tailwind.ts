/**
 * "tailwindcss": "^3.3.3",
 *
 * This file exists because the typing for tailwindcss/resolveConfig is incorrect.
 */

import tailwindConfig from "tailwind.config";
// eslint-disable-next-line import/no-extraneous-dependencies
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

const theme = fullConfig.theme as any;

export const twColors = theme.colors as Record<string, Record<string, string>>;

export default fullConfig;
