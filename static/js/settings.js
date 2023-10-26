function showEditScreen() {
    const editScreen = document.querySelector('.edit-screen');
    editScreen.style.display = 'block';
  }
  
  function hideEditScreen() {
    const editScreen = document.querySelector('.edit-screen');
    editScreen.style.display = 'none';
  }
  
  function saveChanges() {
    const newName = document.getElementById('newName').value;
    const newUserID = document.getElementById('newUserID').value;
  
  
    hideEditScreen();
  }
  
  document.querySelector('.edit-button button').addEventListener('click', showEditScreen);
  
  document.getElementById('saveChanges').addEventListener('click', saveChanges);
  