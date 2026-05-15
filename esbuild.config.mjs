import esbuildPluginTsc from "esbuild-plugin-tsc";

export default () => ({
  bundle: true,
  minify: false,
  sourcemap: false,
  exclude: ["@aws-sdk/*"],
  external: ["@aws-sdk/*"],
  // permite que o serverless deploy rode o tsc, verificando tipagem e adicionando metadados
  plugins: [esbuildPluginTsc()],
});
