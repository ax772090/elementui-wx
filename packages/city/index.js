import City from './src/main';

/* istanbul ignore next */
City.install = function(Vue) {
  Vue.component(City.name, City);
};

export default City;
