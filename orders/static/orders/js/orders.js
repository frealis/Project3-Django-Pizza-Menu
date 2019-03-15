// for (let l = 0; l < localStorage.length; l++) {
//   console.log('l: ', l, JSON.parse(localStorage.getItem(l)));
// };
// localStorage.clear();

document.addEventListener('DOMContentLoaded', function() {

  // Reloads page if user hits the "Back" button
  // https://stackoverflow.com/questions/20899274/how-to-refresh-page-on-back-button-click
  if(!!window.performance && window.performance.navigation.type === 2) {
    console.log('Reloading');
    window.location.reload();
  }

  // --------------------- CREATE LIST ---------------------

  function create_list(name) {
    const li = document.createElement('li');
    li.name = name
    li.innerHTML = name;
    return li;
  }

  // --------------------- DISPLAY ORDER ---------------------

  // Retrieve and display items from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.getItem(i));
  };


});
