import { dirname, join } from "path";
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const config = {
  stories: ['../../../packages/ui/**/*.stories.@(js|jsx|ts|tsx|mdx)'],

  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials"), {
    name: '@storybook/addon-react-native-web',
    options: {
      modulesToTranspile: ['solito', 'react-native-web', 'expo-linking', 'expo-constants', 'expo-modules-core', 'react-i18next', 'expo-document-picker', 'expo-av', 'expo-asset'],
      babelPlugins: []
    }
  }],

  core: {},

  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {}
  },

  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // speeds up storybook build time
      allowSyntheticDefaultImports: false,
      // speeds up storybook build time
      esModuleInterop: false,
      // makes union prop types like variant and size appear as select controls
      shouldExtractLiteralValuesFromEnum: true,
      // makes string and boolean types that can be undefined appear as inputs and switches
      shouldRemoveUndefinedFromOptional: true,
      // Filter out third-party props from node_modules except @mui packages
      propFilter: (prop: any) => (prop.parent ? !/node_modules\/(?!tamagui)/.test(prop.parent.fileName) : true),
    },
  },

  // managerWebpack: (config, options) => {
  //     options.cache.set = () => Promise.resolve();
  //     return config;
  // },
  webpackFinal: async (config: any, { configType }: { configType: any }) => {
    // config.resolve = {
    //     ...config.resolve,
    //     fallback: {
    //         ...(config.resolve || {}).fallback,
    //         fs: false,
    //         stream: false,
    //         os: false,
    //     },
    // }
    // config.cache = {type: 'memory'}
    config.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      resolve: {
        fullySpecified: false,
      },
    })

    // config.resolve.plugins = config.resolve.plugins || []
    // config.resolve.plugins.push(
    //   new TsconfigPathsPlugin({
    //     configFile: path.resolve(__dirname, '../tsconfig.json'),
    //   })
    // )
    return config
  },

  env: (config: any) => ({
    ...config,
    TAMAGUI_TARGET: 'web',
  }),

  docs: {
    autodocs: true
  }
}
export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
