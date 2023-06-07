import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import preprocess from "rollup-plugin-preprocess";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const outdir = "dist/";

const env = {
  MAPRAY_ACCESS_TOKEN: "MTY4NDIyNjYwODllY2U2Njk2YzgyODNjNzliYjE3",
  BINGMAP_ACCESS_TOKEN:
    "Alg8vgLF4ksNTmcrFk_7XL9nhke5A7o3mwka8F7d6kq7TIWdcRq44xLcEsq9J9o6",
};

["MAPRAY_ACCESS_TOKEN", "BINGMAP_ACCESS_TOKEN"].forEach((key) => {
  if (!env[key]) throw new Error(`${key} is missing`);
});

export default function () {
  const isProd = process.env.BUILD === "production";

  const bundle = {
    input: "src/index.ts",
    output: {
      file: outdir + "bundle.js",
      format: "iife",
      indent: false,
      sourcemap: !isProd,
    },
    plugins: [
      postcss(),
      resolve(),
      preprocess({
        include: ["src/**/*.js"],
        exclude: [], // disable default option (node_modules/**)
        context: {
          BUILD: process.env.BUILD,
        },
      }),
      commonjs({
        requireReturnsDefault: "auto",
      }),
      injectProcessEnv(env),
      typescript({
        tsconfig: "./tsconfig.json",
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
          },
        },
      }),
      isProd
        ? terser({
            compress: {
              unused: false,
              collapse_vars: false,
            },
            output: {
              comments: false,
            },
          })
        : null,
    ],
  };

  return bundle;
}
