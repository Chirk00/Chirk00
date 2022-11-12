(function () {

  let objGlobal = [];
  let userName = 'list';

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttomWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');ef
    input.classList.add('form-control');
    input.placeholder = 'Введите название вашего дела';
    buttomWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttomWrapper.append(button);
    form.append(input);
    form.append(buttomWrapper);

    button.disabled = true;
    input.addEventListener('input', function () {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // стили для элемента списка, размешение кнопок в правой части с помощ flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name; //если использовать innerHml, то еслли в name будут попадаться различные скобки они будут становиться тегами, что нам не нужно

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done) {
      item.classList.add('list-grop-item-success')
    }

    //добавляем обработчик на кнопки
    doneButton.addEventListener('click', () => {
      obj.done = !obj.done;
      saveList(objGlobal, userName);
      item.classList.toggle('list-group-item-success');
    });
    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        for (let i = 0; i < objGlobal.length; ++i) {
          if (objGlobal[i].id === obj.id) {
            objGlobal.splice(i, 1);
            break;
          }
        }

        saveList(objGlobal, userName);

        item.remove();
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  function getNewId(arr) {
    let max = 0;

    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].id > max) {
        max = arr[i].id;
      }
    }

    return max + 1;
  }

  function createTodoApp(container, title = 'Список дел', user, defaultList) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    userName = user;
    let localData = localStorage.getItem(userName)

    if (localData !== '' && localData !== null) {
      objGlobal = JSON.parse(localData);
    } else {
      objGlobal = defaultList;
      saveList(objGlobal, userName);
    }

    for (const newItem of objGlobal) {
      let todoItem = createTodoItem(newItem);
      todoList.append(todoItem.item);
    }
    // либо
    // objGlobal.forEach(newItem => {
    //   let todoItem = createTodoItem(newItem);
    //   todoList.append(todoItem.item);
    // })

    //браузер создает событие sumbit на форме по нажатию enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', (e) => {
      //предовращаем перезагрузку страницы при отправке формы
      e.preventDefault();

      //если пользователь ничего не ввел - игнорируем
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItemObj = {
        id: getNewId(objGlobal),
        name: todoItemForm.input.value,
        done: false,
      }

      objGlobal.push(todoItemObj);

      let todoItem = createTodoItem(todoItemObj);
      todoList.append(todoItem.item);

      saveList(objGlobal, userName);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  function saveList(arr, listName) {
    localStorage.setItem(listName, JSON.stringify(arr));
  }

  window.createTodoApp = createTodoApp;
})();