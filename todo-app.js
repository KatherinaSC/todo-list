// приложении to do
(function () {

  let listArray = [];
  let listName = '';

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) { // передаем в аргументе функции, чтобы заголовок было легко изменить
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title; // мы присваем переменной title, который передаем в качестве аргкмента в функцию
    return appTitle;
  };

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div'); // для правильной стилизации кнопки в стилях бустрап
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3'); // для формы устанавливаем 2 класса, input-group содержит в себе нруппу элементов формы и стилизуется бутстрапом, mb-3 чтобы не слеплялась со списком элементов
    input.classList.add('form-control'); // установка класса чтобы бутсрап стилизовал
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append'); // добавляем класс
    button.classList.add('btn', 'btn-primary'); // добавляем классы кнопке
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function () {
      if (input.value !== "") {
        button.disabled = false
      } else {
        button.disabled = true
      };
    })

    // аналогично
    // <form class="input-group mb-3">
    // <input class="form-control" placeholder="Введите название нового дела">
    // <div class="input-group-append">
    // <button class="btn btn-primery">Добавить дело</button>
    //</div >
    //</form >

    return {
      form,
      input, // если не вернем отсюда, то доступа иметь к ним не будем
      button, // если не вернем отсюда, то доступа иметь к ним не будем
    };
  };

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

// создаем форму с делом и с кнопками готово/удалить
  function createTodoItem(obj) {
  let item = document.createElement('li');
  //кнопки помещаем в элемент? который красиво покажет их в одной группе
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  //устанавливаем стили для элемента списка? а также для размещения кнопок в его правой части с помощью flex
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = obj.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

    if (obj.done == true) item.classList.add('list-group-item-success');

  //добоавляем обработчики на кнопки
  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success'); // с помощью toggle добавляем или удаляем по классу

    for (const listItem of listArray) {
      if (listItem.id == obj.id) listItem.done = !listItem.done; //если имя в массиве равно введенному имени, то статус становится противополодным
    };
    saveList(listArray, listName); // сохраняем
  });

  deleteButton.addEventListener('click', function () {
    if (confirm('Вы уверены?')) { //confirm встроена в браузер
      item.remove();

      for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].id == obj.id) listArray.splice(i, 1); // удаление из массива по кнопке удалить
      };
      saveList(listArray, listName); // сохраняем
    };
  });

  //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  //приложению нужен доступ к самому элементу и кнопкам? чтобы обрабатывать события нажатия
  return {
    item,
    doneButton,
    deleteButton,
  };
  };

  // создаем функцию чтобы создавать id для записи
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    } return max + 1;
  }

  function saveList(arr, keyName) { // делаем local storidge - хранение, может хранить строки, булевые значения и числа. массимвы хранить не может
    // любой массив можно преобразовать в строчку:
    localStorage.setItem(keyName, JSON.stringify(arr)); // setItem - установить значение, в скобках имя ключа
    // keyName - название переменной, json.stringify(arr) - данные которые мы храним
  }

  function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {

    let todoAppTitle = createAppTitle(title); // вызываем все 3 функци которые создали до этого
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    listArray = defArray; // при запуске помещаем сразу готовый список дел из index

    container.append(todoAppTitle); // добавляем их в container
    container.append(todoItemForm.form); // тут размещаем только объект?который есть в форме помимо других объектов, сначала берем свойство формы
    container.append(todoList);

    // при ервом запуске мы должны расшифровать локал сторидж
    let localData = localStorage.getItem(listName); // получаем item по listName
    if (localData !== null && localData !== '') listArray = JSON.parse(localData); // проверка на пустоту иначе будет ошибка b преобразовывает массив обратно из строки в массив

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }
    // делаем чтобы при отправке формы создавался новый элемент списка

    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перегазгрузилась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = { //созданный объект для передачи в функцию
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false
      }

      // создаем возможность создавать дело
      let todoItem = createTodoItem(newItem); //передает объект

      listArray.push(newItem); //добавление в массив новые созданные объекты

      saveList(listArray, listName); // сохраняем преобразованный в строчку массив

      // создаем и добавляем в список новое дкло с названием из поля для ввода
      todoList.append(todoItem.item);

      // при отправке делаем кнопку невидимой
      todoItemForm.button.disabled = true;
      //обнуляем значение в поле, чтобы не пришлось стирать его вручную - обновляем форму
      todoItemForm.input.value = '';
    });
  };

  window.createTodoApp = createTodoApp;
})();

