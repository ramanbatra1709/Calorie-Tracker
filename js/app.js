const StorageController = (function()   {
    return  {
        clearItems: function()  {
            localStorage.removeItem('items');
        },
        getItems: function()    {
            return localStorage.getItem('items') === null ? [] : JSON.parse(localStorage.getItem('items'));
        }, 
        deleteItem: function(id)   {
            let items = this.getItems();
            items.forEach(function(item, index)    {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItem: function(updatedItem) {
            let items = this.getItems();
            items.forEach(function(item, index)    {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        storeItem: function(newItem)   {
            let items = this.getItems();
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
        }
    };
})();

const ItemController = (function()  {
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const state = {
        items: StorageController.getItems(),
        currentItem: null,
        totalCalories: 0
    };

    return {
        addItem: function(name, calories) {
            const id = state.items.length > 0 ? state.items[state.items.length -1].id + 1: 0;
            calories = parseInt(calories);
            const newItem = new Item(id, name, calories);
            state.items.push(newItem);
            return newItem;
        },
        clearItems: function()  {
            state.items = [];
        },
        deleteItem: function(id)  {
            state.items = state.items.filter(function(item)    {
                return item.id !== id;
            });
        },
        getCurrentItem: function()  {
            return state.currentItem;
        },
        getItem : function(id)  {
            let item = null;
            state.items.forEach((value) => {
                if (value.id === id) {
                    item = value;
                }
            });
            return item;
        },
        getItems: function() {
            return state.items;
        },
        getTotalCalories: function()    {
            state.totalCalories = state.items.reduce((total, item) => total + item.calories, 0);
            return state.totalCalories;
        },
        setCurrentItem: function(item)  {
            state.currentItem = item;
        },
        updateItem(name, calories)    {
            calories = parseInt(calories);
            let updatedItem = null;
            state.items.forEach(function(item)  {
                if (item.id === state.currentItem.id)   {
                    item.name = name;
                    item.calories = calories;
                    updatedItem = item;
                }
            });
            return updatedItem;
        }
    };
})();

const UIController = (function(){
    const UIItems = {
        addBtn: '.add-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        deleteBtn: '.delete-btn',
        editBtn: 'edit-item',
        items: '#item-list li',
        itemList: '#item-list',
        itemCaloriesInput: '#item-calories',
        itemNameInput: '#item-name',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn'
    };
    return  {
        addItem: function(item) {
            const li = document.createElement('li');
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(UIItems.itemList).insertAdjacentElement('beforeend', li);
        },
        addItemToForm: function()   {
            document.querySelector(UIItems.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
            document.querySelector(UIItems.itemNameInput).value = ItemController.getCurrentItem().name;
        },
        clearInputs: function() {
            document.querySelector(UIItems.itemCaloriesInput).value = '';
            document.querySelector(UIItems.itemNameInput).value = '';
        },
        clearItems: function()  {
            Array.from(document.querySelectorAll(UIItems.items)).forEach(function(item) {
                item.remove();
            });
        },
        deleteItem: function(id)  {
            document.querySelector(`#item-${id}`).remove();
        },
        displayEditState: function(display)  {
            let displayAdd = 'inline', displayEdit = 'none';
            display ? (displayEdit = 'inline', displayAdd = 'none') : this.clearInputs();
            document.querySelector(UIItems.addBtn).style.display = displayAdd;
            document.querySelector(UIItems.backBtn).style.display = displayEdit;
            document.querySelector(UIItems.deleteBtn).style.display = displayEdit;
            document.querySelector(UIItems.updateBtn).style.display = displayEdit;
        },
        getItemInput: function()    {
            return {
                calories: document.querySelector(UIItems.itemCaloriesInput).value,
                name: document.querySelector(UIItems.itemNameInput).value
            };       
        },
        getUIItems: function()  {
            return UIItems;
        },
        populateItems: function(items)   {
            let outputHTML = '';
            items.forEach(function(item) {
                outputHTML += `<li id="item-${item.id}" class="collection-item"><strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`;
            });
            document.querySelector(UIItems.itemList).innerHTML = outputHTML;
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UIItems.totalCalories).textContent = totalCalories;
        },
        updateItem: function(item)  {
            let currentItems = document.querySelectorAll(UIItems.items);
            Array.from(currentItems).forEach(function(domItem) {
                if (domItem.getAttribute('id') === `item-${item.id}`)   {
                    document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        }
    };
})();

const AppController = (function(ItemController, StorageController, UIController){
    const loadEventListeners = function()   {
        const UIItems = UIController.getUIItems();
        document.querySelector(UIItems.addBtn).addEventListener('click', addItemSubmit);
        document.querySelector(UIItems.backBtn).addEventListener('click', UIController.displayEditState(false));
        document.querySelector(UIItems.clearBtn).addEventListener('click', clearItems);
        document.querySelector(UIItems.deleteBtn).addEventListener('click', deleteItemSubmit);
        document.querySelector(UIItems.itemList).addEventListener('click', editItemSubmit);
        document.querySelector(UIItems.updateBtn).addEventListener('click', updateItemSubmit);
    }
    const addItemSubmit = function(event) {
        const itemInput = UIController.getItemInput();
        if (itemInput.calories !== '' && itemInput.name !== '') {
            const newItem = ItemController.addItem(itemInput.name, itemInput.calories);
            UIController.addItem(newItem);
            UIController.showTotalCalories(ItemController.getTotalCalories());
            StorageController.storeItem(newItem);
            UIController.clearInputs();
        }
        event.preventDefault();
    }
    const clearItems = function(event)   {
        ItemController.clearItems();
        UIController.clearItems();
        UIController.showTotalCalories(ItemController.getTotalCalories());
        StorageController.clearItems();
        UIController.displayEditState(false);
        event.preventDefault();
    }
    const deleteItemSubmit = function(event) {
        ItemController.deleteItem(ItemController.getCurrentItem().id);
        UIController.deleteItem(ItemController.getCurrentItem().id);
        UIController.showTotalCalories(ItemController.getTotalCalories());
        StorageController.deleteItem(ItemController.getCurrentItem().id);
        UIController.displayEditState(false);
        event.preventDefault();
    }
    const editItemSubmit = function(event) {
        if (event.target.classList.contains(UIController.getUIItems().editBtn))   {
            const itemId = parseInt(event.target.parentNode.parentNode.id.split('-')[1]);
            const item = ItemController.getItem(itemId);
            ItemController.setCurrentItem(item);
            UIController.addItemToForm();
            UIController.displayEditState(true);
        }
        event.preventDefault();
    }
    const updateItemSubmit = function(event)    {
        const itemInput = UIController.getItemInput();
        if (itemInput.calories !== '' && itemInput.name !== '') {
            const updatedItem = ItemController.updateItem(itemInput.name, itemInput.calories);
            UIController.updateItem(updatedItem);
            UIController.showTotalCalories(ItemController.getTotalCalories());
            StorageController.updateItem(updatedItem);
            UIController.displayEditState(false);
        }
        event.preventDefault();
    }
    return {
        init: function()    {
            UIController.displayEditState(false);
            const items = ItemController.getItems();
            UIController.populateItems(items);
            UIController.showTotalCalories(ItemController.getTotalCalories());
            loadEventListeners();
        }
    };
})(ItemController, StorageController, UIController);

AppController.init();
