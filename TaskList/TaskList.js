// input box
taskInput = document.querySelector('#task-input');
// Add task button
addTask = document.querySelector('.add-btn');
// Remove tasks button
removeTask = document.querySelector('.remove-btn');
// form 1
form1 = document.querySelector('#form1');
// form 2
form2 = document.querySelector('#form2');
// list Collection ul
listCollection = document.querySelector('ul.collection');
// filter Task
filterTasks = document.querySelector('#filter-tasks');


// console.log(removeTask);
function loadEventListeners(){
    document.addEventListener('DOMContentLoaded',getTasks);
    form1.addEventListener('submit',formSubmit);
    form2.addEventListener('submit',formSubmit);
    addTask.addEventListener('click',addingNewTask);
    listCollection.addEventListener('click',deleteItem);
    removeTask.addEventListener('click',clearTasks);
    filterTasks.addEventListener('keyup',filterTaskList);
};
loadEventListeners();
// get Tasks function
function getTasks(e){
    let tasks;
    if (localStorage.getItem('tasks')===null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    // creating li elements for all the tasks present in the local storage

    tasks.forEach(function(task){
        addListItem(task);
    })
    
}


// formSubmit
function formSubmit(e){
    console.log('form submitted');
    e.preventDefault();
}
function addListItem(task){
    // create li element
    li = document.createElement('li');
    // add class names
    li.className = 'collection-item';
    // create link
    link = document.createElement('a');
    // classNames for link
    link.className = "delete-item secondary-content";
    // add icon to link
    link.innerHTML = '<i class="fas fa-times"></i>';
    // append task
    li.appendChild(document.createTextNode(task))
    // append link to li
    li.appendChild(link)
    document.querySelector('ul.collection').appendChild(li);
}
// adding new task function
function addingNewTask(e){
    inputVal = taskInput.value;
    
    if(inputVal === ''){
        alert("Please enter a task");
    }else{
        addListItem(inputVal);
        let tasks;
        if (localStorage.getItem('tasks')===null){
            tasks = [];
        }else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        // append the inputVal to the array
        tasks.push(inputVal);

        // set the updated task back to the local storage
        localStorage.setItem('tasks',JSON.stringify(tasks));

        taskInput.value='';

    }
}
// delete item function
function deleteItem(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        let tasks;
        if (localStorage.getItem('tasks')===null){
            tasks = [];
        }else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        // console.log(tasks);
        tasks.forEach(function(task,index){
            if(e.target.parentElement.parentElement.textContent === task){
                tasks.splice(index, 1);
            }
        })
        // console.log(tasks);
        localStorage.setItem('tasks',JSON.stringify(tasks))

        e.target.parentElement.parentElement.remove();
    }
}
// clear Tasks
function clearTasks(e){
    // list items
    listItems = document.querySelectorAll('ul.collection li');

    listItems.forEach(function(item){
        item.remove();
        localStorage.clear('tasks') 
    })
}

// Filter tasks of lists
function filterTaskList(e){
    let text = e.target.value.toLowerCase();
    let tasks = document.querySelectorAll('.collection-item');

    tasks.forEach(function(task){
        if(task.firstChild.textContent.toLocaleLowerCase().indexOf(text)!=-1){
            task.style.display ="flex";
        }
        else{
            task.style.display="none";
        }
        
    })
}