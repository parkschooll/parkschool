//BOTÂO SOBRE

document.addEventListener('DOMContentLoaded', () => {

  const modalSobreElement = document.getElementById('modalSobre');
  
  const modalSobre = new bootstrap.Modal(modalSobreElement);

  const btnSobre = document.getElementById('btnSobre');

  btnSobre.addEventListener('click', (event) => {
    event.preventDefault();
    modalSobre.show();
  });
});

// BOTÃO TERMOS E PRIVACIDADE

document.addEventListener('DOMContentLoaded', () => {

  const modalTermosElement = document.getElementById('modalTermos');

  const modalTermos = new bootstrap.Modal(modalTermosElement);

  const btnTermos = document.getElementById('btnTermos');

  btnTermos.addEventListener('click', (event) => {
    event.preventDefault();
    modalTermos.show();
  });
});