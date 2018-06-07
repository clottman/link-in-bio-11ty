// docs: https://www.11ty.io/docs/config/

module.exports = function(eleventyConfig) {
  
  // eleventyConfig.addFilter( "myFilter", function() {});
 
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};