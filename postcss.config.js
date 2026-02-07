export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  map: process.env.NODE_ENV === 'development' ? 'inline' : false,

};
