document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el envío del formulario

  const name = document.getElementById('name').value;
  const peso = document.getElementById('peso').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;

  // Guardar datos en el almacenamiento local
  localStorage.setItem('userProfile', JSON.stringify({ name, peso, age, gender }));

  alert('Perfil guardado exitosamente!');
});

// Cargar datos del perfil al cargar la página
window.addEventListener('load', function() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (userProfile) {
    document.getElementById('name').value = userProfile.name;
    document.getElementById('peso').value = userProfile.peso;
    document.getElementById('age').value = userProfile.age;
    document.getElementById('gender').value = userProfile.gender;
  }
});
