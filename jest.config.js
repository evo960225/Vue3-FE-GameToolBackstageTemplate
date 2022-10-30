
const config = { 
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    "transform": {
        ".*\\.(vue)$": "@vue/vue3-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    "moduleFileExtensions": [
        "js",
        "json",
        "vue"
    ],
    "collectCoverage": false,
    "collectCoverageFrom": [
        "**/*.{js,vue}"
    ],
    globals: {
      'vue-jest': {
        babelConfig: true,
      },
    },
}

module.exports = config;