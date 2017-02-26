var people = (function () {
    'use strict';
    var element = document.querySelector('.notes');
    var button = document.querySelector('.add');
    var input = document.querySelector('.note');
    var ul = element.querySelector('ul');

    button.addEventListener('click', addPerson);

    ul.addEventListener('click', deletePerson);

    function deletePerson(event) {
        if (event.target.tagName.toLocaleLowerCase() === 'li') {
            ul.removeChild(event.target);
        }
    }

    function addPerson(value) {
        var name = typeof value === 'string' ? value : input.value;
        var node = document.createElement('LI');
        node.innerHTML = name;
        ul.appendChild(node);
    }

    return {
        delete: deletePerson,
        add: addPerson
    }


})();

